'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartProduct = {
  id: number
  name: string
  slug: string
  priceInCents: number
  imageUrl: string | null
  stock: number
}

export type CartItem = CartProduct & {
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: CartProduct) => void
  setQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (product.stock < 1) {
            return state
          }

          const existingItem = state.items.find((item) => item.id === product.id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          }
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'boutique-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
