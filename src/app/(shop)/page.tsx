import Link from 'next/link'

import { ProductCard, type ProductCardData } from '@/components/storefront/ProductCard'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Maison Essentielle | Des objets faits pour durer',
  description: 'Une sélection d’objets utiles, choisis pour leur simplicité et leur durabilité.',
}

export default async function ShopPage() {
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-createdAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  const productCards: ProductCardData[] = products.map((product) => {
    const image = typeof product.image === 'object' && product.image !== null ? product.image : null
    const category =
      typeof product.category === 'object' && product.category !== null ? product.category : null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryLabel: category?.name ?? 'Sélection',
      description: product.description ?? null,
      priceInCents: product.priceInCents,
      stock: product.stock,
      imageUrl: image?.url ?? null,
      imageAlt: image?.alt ?? product.name,
    }
  })

  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Une vie plus simple, un objet à la fois</p>
          <h1>
            Les essentiels
            <br />
            bien choisis.
          </h1>
          <p className="hero__description">
            Des pièces utiles, des matières sincères et des lignes qui traversent le temps.
          </p>
          <Link className="button" href="#collection">
            Découvrir la collection
          </Link>
        </div>

        <div aria-hidden="true" className="hero__art">
          <div className="hero__sun" />
          <div className="hero__vase hero__vase--back" />
          <div className="hero__vase hero__vase--front" />
          <div className="hero__stem hero__stem--one" />
          <div className="hero__stem hero__stem--two" />
          <div className="hero__table" />
          <span className="hero__art-label">Objets du quotidien · sélection 01</span>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pensés pour durer</p>
            <h2>La collection</h2>
          </div>
          <p>Moins, mais mieux. Découvrez les pièces disponibles en boutique.</p>
        </div>

        {productCards.length > 0 ? (
          <div className="product-grid">
            {productCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-collection">
            <p>La collection se prépare.</p>
            <span>Publiez vos premiers produits depuis l’espace d’administration.</span>
            <Link href="/admin">Ouvrir l’administration</Link>
          </div>
        )}
      </section>

      <section className="values-strip" aria-label="Nos engagements">
        <div>
          <span className="values-strip__number">01</span>
          <p>Des matières choisies avec soin</p>
        </div>
        <div>
          <span className="values-strip__number">02</span>
          <p>Une esthétique qui reste</p>
        </div>
        <div>
          <span className="values-strip__number">03</span>
          <p>Un quotidien plus juste</p>
        </div>
      </section>
    </>
  )
}
