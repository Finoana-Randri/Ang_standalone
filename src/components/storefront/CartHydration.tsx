'use client'

import { useEffect, type ReactNode } from 'react'

import { useCartStore } from '@/store/cart-store'

export function CartHydration({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate()
  }, [])

  return children
}
