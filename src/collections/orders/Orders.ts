import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '@/access/isAuthenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    defaultColumns: ['id', 'customerName', 'totalInCents', 'status', 'createdAt'],
    group: 'Commandes',
    useAsTitle: 'customerName',
  },
  access: {
    read: isAuthenticated,
    create: () => false,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'unitPriceInCents',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'lineTotalInCents',
          type: 'number',
          min: 0,
          required: true,
        },
      ],
    },
    {
      name: 'totalInCents',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Payée', value: 'paid' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      required: true,
    },
  ],
}
