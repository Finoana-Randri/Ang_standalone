import Image from 'next/image'

import { AddToCartButton } from './AddToCartButton'
import { formatPrice } from '@/lib/formatPrice'

export type ProductCardData = {
  id: number
  name: string
  slug: string
  categoryLabel: string
  description: string | null
  priceInCents: number
  stock: number
  imageUrl: string | null
  imageAlt: string
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        {product.imageUrl ? (
          <Image
            alt={product.imageAlt}
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
            src={product.imageUrl}
          />
        ) : (
          <div aria-hidden="true" className="image-placeholder">
            <span>ME</span>
          </div>
        )}
        <span className="product-card__category">{product.categoryLabel}</span>
      </div>

      <div className="product-card__details">
        <div>
          <h3>{product.name}</h3>
          {product.description && <p>{product.description}</p>}
        </div>
        <div className="product-card__purchase">
          <strong>{formatPrice(product.priceInCents)}</strong>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  )
}
