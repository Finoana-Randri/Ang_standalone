import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '@/access/isAuthenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Catalogue',
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 360,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
