import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { selectItems } from "./cartSlice";

const STORAGE_KEY = "cart.items";

const saveToStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  const items = selectItems(state);
  saveToStorage(STORAGE_KEY, items);
});

export default store;
