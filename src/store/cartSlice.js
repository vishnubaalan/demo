import { createSlice, createSelector } from '@reduxjs/toolkit';

const STORAGE_KEY = 'cart.items';
const DEFAULT_STOCK = 99;

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const readFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  items: readFromStorage(STORAGE_KEY, []),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, qty = 1 } = action.payload || {};
      if (!product || !product.id) return;
      const idx = state.items.findIndex((i) => i.id === product.id);
      const stock = toNumber(product.stock, DEFAULT_STOCK);
      if (idx !== -1) {
        const nextQty = Math.min(stock, toNumber(state.items[idx].quantity, 1) + toNumber(qty, 1));
        state.items[idx].quantity = nextQty;
        return;
      }
      const price = toNumber(product.price, 0);
      state.items.unshift({
        id: product.id,
        title: product.title || 'Untitled',
        price,
        thumbnail: product.thumbnail || product.images?.[0] || '',
        stock,
        quantity: Math.min(stock, Math.max(1, toNumber(qty, 1))),
      });
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    clear: (state) => {
      state.items = [];
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload || {};
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx === -1) return;
      const item = state.items[idx];
      const nextQty = clamp(toNumber(qty, 1), 1, item.stock || DEFAULT_STOCK);
      state.items[idx].quantity = nextQty;
    },
  },
});

export const { addItem, removeItem, clear, updateQty } = cartSlice.actions;

export const selectItems = (state) => state.cart.items;

export const selectTotals = createSelector([selectItems], (items) => {
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
});

export default cartSlice.reducer;
