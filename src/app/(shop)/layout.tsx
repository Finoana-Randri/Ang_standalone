import type { ReactNode } from 'react'
import Link from 'next/link'

import { CartHydration } from '@/components/storefront/CartHydration'
import { StoreHeader } from '@/components/storefront/StoreHeader'

import './styles.css'

export const metadata = {
  description: 'Une sélection d’objets utiles, choisis pour leur simplicité et leur durabilité.',
  title: 'Maison Essentielle',
}

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="store-body">
        <CartHydration>
          <div className="store-shell">
            <StoreHeader />
            <main>{children}</main>
            <footer className="site-footer">
              <Link className="brand" href="/">
                MAISON <span>ESSENTIELLE</span>
              </Link>
              <p>Des essentiels choisis pour durer.</p>
              <span>© {new Date().getFullYear()} Maison Essentielle</span>
            </footer>
          </div>
        </CartHydration>
      </body>
    </html>
  )
}
