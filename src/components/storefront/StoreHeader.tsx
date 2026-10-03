import Link from 'next/link'

import { CartCount } from './CartCount'

export function StoreHeader() {
  return (
    <header className="site-header">
      <Link aria-label="Accueil de la boutique" className="brand" href="/">
        MAISON <span>ESSENTIELLE</span>
      </Link>

      <nav aria-label="Navigation principale" className="site-nav">
        <Link href="/#collection">La collection</Link>
        <Link className="cart-link" href="/panier">
          Panier <CartCount />
        </Link>
      </nav>
    </header>
  )
}
