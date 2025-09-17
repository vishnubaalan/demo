import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "cart.items";
const DEFAULT_STOCK = 99;

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const readFromStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const writeToStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readFromStorage(STORAGE_KEY, []));

  useEffect(() => {
    writeToStorage(STORAGE_KEY, items);
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    if (!product || !product.id) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      const stock = toNumber(product.stock, DEFAULT_STOCK);

      if (idx !== -1) {
        const next = [...prev];
        const newQty = Math.min(stock, next[idx].quantity + qty);
        if (newQty === next[idx].quantity) return prev;
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }

      const price = toNumber(product.price, 0);
      return [
        {
          id: product.id,
          title: product.title || "Untitled",
          price,
          thumbnail: product.thumbnail || product.images?.[0] || "",
          stock,
          quantity: Math.min(stock, Math.max(1, qty)),
        },
        ...prev,
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems((prev) => (prev.length ? [] : prev));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => {
      let changed = false;
      const next = prev.map((i) => {
        if (i.id !== id) return i;
        const nextQty = clamp(toNumber(qty, 1), 1, i.stock || DEFAULT_STOCK);
        if (nextQty === i.quantity) return i;
        changed = true;
        return { ...i, quantity: nextQty };
      });
      return changed ? next : prev;
    });
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        const quantity = toNumber(i.quantity, 0);
        const price = toNumber(i.price, 0);
        acc.count += quantity;
        acc.subtotal += price * quantity;
        return acc;
      },
      { count: 0, subtotal: 0 }
    );
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, totals }),
    [items, addItem, removeItem, updateQty, clear, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}