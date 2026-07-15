import type { Block } from 'payload'

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
      type: 'textarea',
      defaultValue: 'Your gift helps support women building stable, independent futures.',
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
