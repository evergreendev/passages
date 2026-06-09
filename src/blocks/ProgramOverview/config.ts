import type { Block } from 'payload'

import { link } from '@/fields/link'

export const programIconOptions = [
  { label: 'Life skills', value: 'lifeSkills' },
  { label: 'Employment', value: 'employment' },
  { label: 'Spiritual growth', value: 'spiritualGrowth' },
  { label: 'Physical health', value: 'physicalHealth' },
  { label: 'Relationships', value: 'relationships' },
] as const

export const ProgramOverview: Block = {
  slug: 'programOverview',
  interfaceName: 'ProgramOverviewBlock',
  labels: {
    singular: 'Program Overview',
    plural: 'Program Overviews',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'areas',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [...programIconOptions],
          required: true,
        },
      ],
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          description: 'Optional centered call to action.',
        },
      },
    }),
  ],
}
