import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Primary site logo used in the header and footer.',
      },
    },
    {
      name: 'siteTitle',
      type: 'text',
      defaultValue: 'Passages',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'text',
      defaultValue: "Women's Transitional Living",
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
