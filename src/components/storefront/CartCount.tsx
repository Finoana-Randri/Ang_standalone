'use client'

import { useCartStore } from '@/store/cart-store'

export function CartCount() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )

  return <span className="cart-count">{count}</span>
}
