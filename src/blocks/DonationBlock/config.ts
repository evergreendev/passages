import type { Block } from 'payload'

const defaultThankYouMessage = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Thank you. Your donation was received.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

const defaultDescription = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Your gift helps support women building stable, independent futures.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

export const DonationBlock: Block = {
  slug: 'donationBlock',
  interfaceName: 'DonationBlock',
  labels: {
    singular: 'Donation Block',
    plural: 'Donation Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Make a donation',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      defaultValue: defaultDescription,
    },
    {
      name: 'donationEmail',
      type: 'email',
      admin: {
        description:
          'Stored on the Stripe PaymentIntent metadata for donation routing or notifications.',
      },
      required: true,
    },
    {
      name: 'thankYouMessage',
      type: 'richText',
      defaultValue: defaultThankYouMessage,
      label: 'Thank You Message',
      required: true,
    },
    {
      name: 'supportOptions',
      type: 'array',
      defaultValue: [{ label: 'General support' }],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        singular: 'Support Option',
        plural: 'Support Options',
      },
      minRows: 1,
      required: true,
    },
    {
      name: 'presetAmounts',
      type: 'array',
      defaultValue: [{ amount: 25 }, { amount: 50 }, { amount: 100 }, { amount: 250 }],
      fields: [
        {
          name: 'amount',
          type: 'number',
          min: 1,
          required: true,
        },
      ],
      labels: {
        singular: 'Preset Amount',
        plural: 'Preset Amounts',
      },
      maxRows: 6,
      minRows: 1,
      required: true,
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Donate',
      required: true,
    },
  ],
}
