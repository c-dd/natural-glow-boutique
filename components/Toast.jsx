'use client';

/**
 * Add-to-cart toast (handoff README §Interactions).
 *
 * Mounted once in app/layout.jsx via <ToastProvider>. Anything that adds to
 * the cart fires it:
 *
 *   const { fireToast } = useToast();
 *   fireToast(product);            // product object from lib/products.js
 *
 * or, more usually, the combined helper that adds *and* toasts in one call:
 *
 *   const addToCart = useAddToCart();
 *   addToCart(product);            // qty defaults to 1
 *   addToCart(product, qty);
 *
 * Auto-dismisses after 3.2s; consecutive adds replace the contents and reset
 * the timer rather than stacking a second toast.
 */

import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCart } from '@/lib/cart';

const AUTO_DISMISS_MS = 3200;

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setToast(null);
  }, []);

  const fireToast = useCallback((product) => {
    if (!product) return;
    setToast({ name: product.name, image: product.image, key: Date.now() });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
  }, []);

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const value = useMemo(() => ({ toast, fireToast, dismiss }), [toast, fireToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/** Adds to the cart and fires the toast — the standard add-to-cart action. */
export function useAddToCart() {
  const { add } = useCart();
  const { fireToast } = useToast();
  return useCallback(
    (product, qty = 1) => {
      if (!product) return;
      add(product.id, qty);
      fireToast(product);
    },
    [add, fireToast]
  );
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div
      key={toast.key}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 18,
        right: 18,
        zIndex: 60,
        background: 'var(--ng-bg)',
        border: '1px solid var(--ng-rule-toast)',
        boxShadow: 'var(--ng-shadow-toast)',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '14px 16px',
        width: 320,
        animation: 'ng-toast .3s ease',
      }}
    >
      <div
        role="img"
        aria-label={toast.name}
        style={{
          width: 44,
          height: 54,
          flex: 'none',
          backgroundColor: 'var(--ng-img-placeholder)',
          backgroundImage: `url('${toast.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 'var(--ng-t-9)',
            letterSpacing: 'var(--ng-ls-toast)',
            color: 'var(--ng-muted)',
            fontWeight: 500,
          }}
        >
          ADDED TO CART
        </div>
        <div
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-16)',
            marginTop: 3,
          }}
        >
          {toast.name}
        </div>
        <Link
          href="/cart"
          onClick={onDismiss}
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-toast-link)',
            borderBottom: '1px solid var(--ng-ink)',
            display: 'inline-block',
            paddingBottom: 2,
            marginTop: 8,
          }}
        >
          VIEW CART
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className="ng-toast-close"
        onClick={onDismiss}
        style={{
          alignSelf: 'flex-start',
          color: 'var(--ng-muted)',
          fontSize: 15,
          lineHeight: 1,
          padding: '2px 4px',
        }}
      >
        ×
      </button>
    </div>
  );
}
