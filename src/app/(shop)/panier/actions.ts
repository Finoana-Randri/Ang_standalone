'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import type { CheckoutState } from '@/features/checkout/checkout-state'
import { getPayloadClient } from '@/lib/payload'

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
})

const customerSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom.').max(120),
  email: z.string().trim().email('Indiquez une adresse e-mail valide.').max(254),
  phone: z.string().trim().max(40),
  street: z.string().trim().min(3, 'Indiquez une adresse.').max(180),
  postalCode: z.string().trim().min(2, 'Indiquez votre code postal.').max(20),
  city: z.string().trim().min(2, 'Indiquez votre ville.').max(100),
  country: z.string().trim().min(2, 'Indiquez votre pays.').max(80),
})

function errorState(message: string): CheckoutState {
  return { status: 'error', message }
}

export async function createOrder(
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const customer = customerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    street: formData.get('street'),
    postalCode: formData.get('postalCode'),
    city: formData.get('city'),
    country: formData.get('country'),
  })

  if (!customer.success) {
    return errorState(customer.error.issues[0]?.message ?? 'Vérifiez les informations saisies.')
  }

  const rawItems = formData.get('items')

  if (typeof rawItems !== 'string') {
    return errorState('Votre panier est vide ou invalide.')
  }

  let submittedItems: unknown

  try {
    submittedItems = JSON.parse(rawItems)
  } catch {
    return errorState('Votre panier est invalide. Rechargez la page et réessayez.')
  }

  const parsedItems = z.array(cartItemSchema).min(1).max(50).safeParse(submittedItems)

  if (!parsedItems.success) {
    return errorState('Votre panier est invalide. Rechargez la page et réessayez.')
  }

  const quantityByProduct = new Map<number, number>()

  for (const item of parsedItems.data) {
    quantityByProduct.set(
      item.productId,
      (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
    )
  }

  const requestedItems = [...quantityByProduct.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }))

  if (requestedItems.some((item) => item.quantity > 20)) {
    return errorState('La quantité demandée dépasse la limite autorisée.')
  }

  try {
    const payload = await getPayloadClient()
    const productIds = requestedItems.map((item) => item.productId)
    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: productIds.length,
      overrideAccess: true,
      where: {
        and: [{ id: { in: productIds } }, { status: { equals: 'published' } }],
      },
    })

    if (products.length !== requestedItems.length) {
      return errorState('Un article de votre panier n’est plus disponible.')
    }

    const productById = new Map(products.map((product) => [product.id, product]))
    const orderItems = []

    for (const requestedItem of requestedItems) {
      const product = productById.get(requestedItem.productId)

      if (!product) {
        return errorState('Un article de votre panier n’est plus disponible.')
      }

      if (requestedItem.quantity > product.stock) {
        return errorState(`Le stock disponible pour « ${product.name} » est insuffisant.`)
      }

      if (
        !Number.isSafeInteger(product.priceInCents) ||
        product.priceInCents < 0 ||
        !Number.isSafeInteger(product.stock)
      ) {
        return errorState(`Le prix ou le stock de « ${product.name} » doit être vérifié.`)
      }

      orderItems.push({
        product: product.id,
        productName: product.name,
        quantity: requestedItem.quantity,
        unitPriceInCents: product.priceInCents,
        lineTotalInCents: product.priceInCents * requestedItem.quantity,
      })
    }

    const totalInCents = orderItems.reduce((total, item) => total + item.lineTotalInCents, 0)

    if (!Number.isSafeInteger(totalInCents)) {
      return errorState('Le montant de votre commande est invalide.')
    }

    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        customerName: customer.data.name,
        email: customer.data.email,
        phone: customer.data.phone,
        shippingAddress: {
          street: customer.data.street,
          postalCode: customer.data.postalCode,
          city: customer.data.city,
          country: customer.data.country,
        },
        items: orderItems,
        totalInCents,
        currency: 'EUR',
        status: 'pending',
      },
    })

    revalidatePath('/')

    return {
      status: 'success',
      message: 'Votre commande a bien été enregistrée.',
      orderNumber: String(order.id),
    }
  } catch (error) {
    console.error('Impossible de créer la commande.', error)
    return errorState('La commande n’a pas pu être créée. Réessayez dans un instant.')
  }
}
