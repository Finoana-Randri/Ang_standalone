'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'

import { createOrder } from './actions'
import { initialCheckoutState } from '@/features/checkout/checkout-state'
import { formatPrice } from '@/lib/formatPrice'
import { useCartStore } from '@/store/cart-store'

export function CartPage() {
  const [state, formAction, isPending] = useActionState(createOrder, initialCheckoutState)
  const items = useCartStore((cart) => cart.items)
  const setQuantity = useCartStore((cart) => cart.setQuantity)
  const removeItem = useCartStore((cart) => cart.removeItem)
  const clearCart = useCartStore((cart) => cart.clearCart)
  const totalInCents = items.reduce((total, item) => total + item.priceInCents * item.quantity, 0)

  useEffect(() => {
    if (state.status === 'success') {
      clearCart()
    }
  }, [clearCart, state.status])

  if (state.status === 'success') {
    return (
      <section className="checkout-result" aria-live="polite">
        <p className="eyebrow">Commande confirmée</p>
        <h1>Merci pour votre commande.</h1>
        <p>{state.message}</p>
        {state.orderNumber && <p className="order-number">Référence : {state.orderNumber}</p>}
        <Link className="button" href="/">
          Continuer mes achats
        </Link>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="empty-cart">
        <p className="eyebrow">Votre sélection</p>
        <h1>Votre panier est vide.</h1>
        <p>Parcourez la collection pour trouver votre prochain essentiel.</p>
        <Link className="button" href="/#collection">
          Découvrir la collection
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="cart-page__heading">
        <p className="eyebrow">Votre sélection</p>
        <h1>Panier</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item__image">
                {item.imageUrl ? (
                  <Image alt="" fill sizes="100px" src={item.imageUrl} />
                ) : (
                  <div aria-hidden="true" className="image-placeholder">
                    <span>ME</span>
                  </div>
                )}
              </div>

              <div className="cart-item__details">
                <h2>{item.name}</h2>
                <p>{formatPrice(item.priceInCents)}</p>
                <div className="quantity-control" aria-label={`Quantité de ${item.name}`}>
                  <button
                    aria-label={`Retirer une unité de ${item.name}`}
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    type="button"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={`Ajouter une unité de ${item.name}`}
                    disabled={item.quantity >= item.stock}
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item__total">
                <strong>{formatPrice(item.priceInCents * item.quantity)}</strong>
                <button className="text-button" onClick={() => removeItem(item.id)} type="button">
                  Retirer
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="checkout-card">
          <div className="checkout-card__summary">
            <span>Total de la commande</span>
            <strong>{formatPrice(totalInCents)}</strong>
          </div>
          <p className="checkout-card__note">Le paiement en ligne sera ajouté à cette étape.</p>

          <form action={formAction} className="checkout-form">
            <h2>Livraison</h2>
            <label>
              Nom complet
              <input autoComplete="name" maxLength={120} name="name" required />
            </label>
            <label>
              Adresse e-mail
              <input autoComplete="email" maxLength={254} name="email" required type="email" />
            </label>
            <label>
              Téléphone <span className="optional-label">(facultatif)</span>
              <input autoComplete="tel" maxLength={40} name="phone" type="tel" />
            </label>
            <label>
              Adresse
              <input autoComplete="street-address" maxLength={180} name="street" required />
            </label>
            <div className="checkout-form__row">
              <label>
                Code postal
                <input autoComplete="postal-code" maxLength={20} name="postalCode" required />
              </label>
              <label>
                Ville
                <input autoComplete="address-level2" maxLength={100} name="city" required />
              </label>
            </div>
            <label>
              Pays
              <input autoComplete="country-name" maxLength={80} name="country" required />
            </label>
            <input
              name="items"
              type="hidden"
              value={JSON.stringify(items.map(({ id, quantity }) => ({ productId: id, quantity })))}
            />

            {state.status === 'error' && (
              <p className="form-message form-message--error" role="alert">
                {state.message}
              </p>
            )}

            <button className="button checkout-submit" disabled={isPending} type="submit">
              {isPending ? 'Enregistrement…' : 'Confirmer la commande'}
            </button>
          </form>
        </aside>
      </div>
    </section>
  )
}
