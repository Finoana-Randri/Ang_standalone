'use client'

import { useState } from 'react'

import { useCartStore, type CartProduct } from '@/store/cart-store'

export function AddToCartButton({ product }: { product: CartProduct }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <button
      className="button button--small"
      disabled={product.stock < 1}
      onClick={handleAdd}
      type="button"
    >
      {product.stock < 1 ? 'Épuisé' : added ? 'Ajouté au panier' : 'Ajouter au panier'}
    </button>
  )
}
