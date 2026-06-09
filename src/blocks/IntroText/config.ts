import type { Block } from 'payload'

export const IntroText: Block = {
  slug: 'introText',
  interfaceName: 'IntroTextBlock',
  labels: {
    singular: 'Intro Text',
    plural: 'Intro Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
