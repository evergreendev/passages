import type { Block } from 'payload'

export const PreApplicationFormBlock: Block = {
  slug: 'preApplicationFormBlock',
  interfaceName: 'PreApplicationFormBlock',
  labels: {
    singular: 'Pre-Application Form',
    plural: 'Pre-Application Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Pre-Application Form',
      required: true,
    },
    {
      name: 'introText',
      type: 'textarea',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      defaultValue: 'Thank you. Your pre-application has been submitted.',
      required: true,
    },
    {
      name: 'submitButtonText',
      type: 'text',
      defaultValue: 'Submit pre-application',
      required: true,
    },
    {
      name: 'notificationEmails',
      type: 'textarea',
      admin: {
        description:
          'Send notification emails after each submission. Enter one email per line or separate addresses with commas.',
      },
      label: 'Notification Emails',
    },
  ],
}
