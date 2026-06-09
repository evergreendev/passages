import type { Block } from 'payload'

import { link } from '@/fields/link'

export const PassagesHero: Block = {
  slug: 'passagesHero',
  interfaceName: 'PassagesHeroBlock',
  labels: {
    singular: 'Passages Hero',
    plural: 'Passages Heroes',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      admin: {
        description: 'Optional brand image shown over the hero.',
      },
      relationTo: 'media',
    },
    {
      name: 'event',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'dateText',
          type: 'text',
          label: 'Date text',
          required: true,
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              description: 'Optional event reservation link.',
            },
          },
        }),
      ],
    },
    {
      name: 'headline',
      type: 'textarea',
      required: true,
    },
    {
      name: 'actions',
      type: 'array',
      fields: [
        link({ appearances: false }),
        {
          name: 'style',
          type: 'select',
          defaultValue: 'green',
          options: [
            {
              label: 'Green',
              value: 'green',
            },
            {
              label: 'Blue',
              value: 'blue',
            },
            {
              label: 'Outline',
              value: 'outline',
            },
          ],
          required: true,
        },
      ],
      maxRows: 2,
    },
  ],
}
