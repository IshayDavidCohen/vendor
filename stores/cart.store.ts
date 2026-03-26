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

interface CartState {
  items: CartItem[];
  addItem: (item: Item, supplierId: string, supplierName: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearSupplierItems: (supplierId: string) => void;
  getItemsBySupplierId: () => Record<string, CartItem[]>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSupplierSubtotal: (supplierId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, supplierId, supplierName, quantity = 1) => {
        set(state => {
          const existingItem = state.items.find(i => i.item.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.item.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { item, quantity, supplierId, supplierName }],
          };
        });
      },

      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(i => i.item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.item.id === itemId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      clearSupplierItems: (supplierId) => {
        set(state => ({
          items: state.items.filter(i => i.supplierId !== supplierId),
        }));
      },

      getItemsBySupplierId: () => {
        return get().items.reduce(
          (acc, item) => {
            if (!acc[item.supplierId]) {
              acc[item.supplierId] = [];
            }
            acc[item.supplierId].push(item);
            return acc;
          },
          {} as Record<string, CartItem[]>,
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, cartItem) => {
          const price =
            cartItem.item.custom_prices?.[cartItem.supplierId] ??
            cartItem.item.base_price;
          return total + price * cartItem.quantity;
        }, 0);
      },

      getSupplierSubtotal: (supplierId) => {
        return get()
          .items.filter(i => i.supplierId === supplierId)
          .reduce((total, cartItem) => {
            const price =
              cartItem.item.custom_prices?.[supplierId] ??
              cartItem.item.base_price;
            return total + price * cartItem.quantity;
          }, 0);
      },
    }),
    {
      name: 'vendor-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
