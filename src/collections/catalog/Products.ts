import type { CollectionConfig } from 'payload'

import { isAuthenticated, isPublishedOrAuthenticated } from '@/access/isAuthenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['name', 'category', 'priceInCents', 'stock', 'status'],
    group: 'Catalogue',
    useAsTitle: 'name',
  },
  access: {
    read: isPublishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priceInCents',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
