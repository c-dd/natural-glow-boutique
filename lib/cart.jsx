'use client';

/**
 * Cart state — React context + localStorage.
 *
 * Storage key: `ngb-cart-v1`. Shape: `[{ id, qty }]` (the short product ids
 * from lib/products.js). Written on every change, restored on load.
 *
 * SSR/export-safe: the provider always renders with an empty cart on the
 * server and on the first client paint, then hydrates from localStorage in an
 * effect. Nothing is written back to storage until that first read has
 * happened, so a hydrating page can never clobber a saved cart with `[]`.
 * Anything that renders a live count should therefore be resilient to a
 * one-frame `0` (see `hydrated`).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { byId, products } from '@/lib/products';

const STORAGE_KEY = 'ngb-cart-v1';

const CartContext = createContext(null);

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    // Drop anything that isn't a known product or a sane quantity.
    return parsed
      .filter((entry) => entry && products.some((p) => p.id === entry.id))
      .map((entry) => ({
        id: entry.id,
        qty: Math.max(1, Math.floor(Number(entry.qty)) || 1),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Restore once, on mount.
  useEffect(() => {
    const stored = readStored();
    hydratedRef.current = true;
    if (stored.length) setItems(stored);
    setHydrated(true);
  }, []);

  // Persist on every change — but never before the restore has run.
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode, quota) — cart stays in memory */
    }
  }, [items]);

  const add = useCallback((id, qty = 1) => {
    const amount = Math.max(1, Math.floor(Number(qty)) || 1);
    setItems((prev) => {
      const existing = prev.find((entry) => entry.id === id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === id ? { ...entry, qty: entry.qty + amount } : entry
        );
      }
      return [...prev, { id, qty: amount }];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    const amount = Math.floor(Number(qty)) || 0;
    setItems((prev) =>
      amount < 1
        ? prev.filter((entry) => entry.id !== id)
        : prev.map((entry) => (entry.id === id ? { ...entry, qty: amount } : entry))
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, entry) => sum + entry.qty, 0);
    const subtotal = items.reduce((sum, entry) => {
      const product = byId(entry.id);
      return sum + (product ? product.price * entry.qty : 0);
    }, 0);
    // Cart rows joined to catalog data — what /cart and /checkout render.
    const lines = items
      .map((entry) => {
        const product = byId(entry.id);
        if (!product) return null;
        return { ...product, qty: entry.qty, line: product.price * entry.qty };
      })
      .filter(Boolean);

    return {
      items,
      lines,
      count,
      subtotal,
      hydrated,
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, hydrated, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export { STORAGE_KEY as CART_STORAGE_KEY };
