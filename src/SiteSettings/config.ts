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
      name: 'siteTitle',
      type: 'text',
      defaultValue: 'Passages',
      required: true,
    },
    {
      name: 'metaDescription',
      type: 'text',
      defaultValue:
        "Passages Women's Transitional Living helps women move toward stability, purpose, and independence.",
      label: 'Meta description',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
