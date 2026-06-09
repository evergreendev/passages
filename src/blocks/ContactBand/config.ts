import type { Block } from 'payload'

export const ContactBand: Block = {
  slug: 'contactBand',
  interfaceName: 'ContactBandBlock',
  labels: {
    singular: 'Contact Band',
    plural: 'Contact Bands',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Mail', value: 'mail' },
            { label: 'Phone', value: 'phone' },
          ],
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'lines',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
          required: true,
        },
      ],
      maxRows: 3,
      minRows: 1,
      required: true,
    },
  ],
}
