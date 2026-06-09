import type { GlobalConfig } from 'payload'

import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'address',
      type: 'richText',
      admin: {
        description: 'Mailing address shown in the footer.',
      },
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone number',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
