import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '@/access/isAuthenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Administration',
    useAsTitle: 'email',
  },
  access: {
    create: async ({ req }) => {
      if (req.user) {
        return true
      }

      const { totalDocs } = await req.payload.count({
        collection: 'users',
        overrideAccess: true,
      })

      return totalDocs === 0
    },
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
