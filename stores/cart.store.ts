// stores/cart.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Item } from '@/types';

export interface CartItem {
  item: Item;
  quantity: number;
  supplierId: string;
  supplierName: string;
}

export type CurrencyTotals = Record<string, number>;

interface CartState {
  items: CartItem[];
  addItem: (item: Item, supplierId: string, supplierName: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearSupplierItems: (supplierId: string) => void;
  getItemsBySupplierId: () => Record<string, CartItem[]>;
  getTotalItems: () => number;
  /** Returns price totals grouped by currency. Requires the acting businessId to resolve custom prices. */
  getCurrencyTotals: (businessId: string | null) => CurrencyTotals;
  /** Returns per-supplier currency totals. */
  getSupplierCurrencyTotals: (supplierId: string, businessId: string | null) => CurrencyTotals;
}

/** Resolve the effective unit price for a cart item given the acting business. */
export function resolveUnitPrice(cartItem: CartItem, businessId: string | null): number {
  if (businessId) {
    const custom = cartItem.item.custom_prices?.[businessId];
    if (typeof custom === 'number') return custom;
  }
  return cartItem.item.base_price;
}

function addToBucket(bucket: CurrencyTotals, currency: string, amount: number): void {
  bucket[currency] = (bucket[currency] ?? 0) + amount;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, supplierId, supplierName, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i.item.id === item.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return {
            items: [...state.items, { item, quantity, supplierId, supplierName }],
          };
        });
      },

      removeItem: itemId => {
        set(state => ({ items: state.items.filter(i => i.item.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set(state => ({
          items: state.items.map(i => (i.item.id === itemId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      clearSupplierItems: supplierId => {
        set(state => ({ items: state.items.filter(i => i.supplierId !== supplierId) }));
      },

      getItemsBySupplierId: () =>
        get().items.reduce<Record<string, CartItem[]>>((acc, ci) => {
          (acc[ci.supplierId] ??= []).push(ci);
          return acc;
        }, {}),

      getTotalItems: () => get().items.reduce((n, ci) => n + ci.quantity, 0),

      getCurrencyTotals: businessId => {
        const totals: CurrencyTotals = {};
        for (const ci of get().items) {
          const unit = resolveUnitPrice(ci, businessId);
          addToBucket(totals, ci.item.currency, unit * ci.quantity);
        }
        return totals;
      },

      getSupplierCurrencyTotals: (supplierId, businessId) => {
        const totals: CurrencyTotals = {};
        for (const ci of get().items) {
          if (ci.supplierId !== supplierId) continue;
          const unit = resolveUnitPrice(ci, businessId);
          addToBucket(totals, ci.item.currency, unit * ci.quantity);
        }
        return totals;
      },
    }),
    {
      name: 'vendor-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);