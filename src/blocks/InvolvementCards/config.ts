import type { Block } from 'payload'

import { link } from '@/fields/link'

export const involvementIconOptions = [
  { label: 'Heart', value: 'heart' },
  { label: 'People', value: 'people' },
  { label: 'Bed', value: 'bed' },
  { label: 'Mail', value: 'mail' },
  { label: 'Phone', value: 'phone' },
] as const

export const InvolvementCards: Block = {
  slug: 'involvementCards',
  interfaceName: 'InvolvementCardsBlock',
  labels: {
    singular: 'Involvement Cards',
    plural: 'Involvement Cards',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [...involvementIconOptions],
          required: true,
        },
        link({ appearances: false }),
        {
          name: 'buttonStyle',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
          ],
          required: true,
        },
      ],
      maxRows: 6,
      minRows: 1,
    },
  ],
}
