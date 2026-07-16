import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { revalidateEventAfterChange, revalidateEventAfterDelete } from './hooks/revalidateEvent'

type EventLinkSiblingData = {
  linkType?: 'external' | 'internal'
}

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'startDate', '_status', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    content: true,
    startDate: true,
    linkType: true,
    externalLink: true,
    internalPage: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      index: true,
      required: true,
    },
    {
      name: 'linkType',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'external',
      options: [
        {
          label: 'External link',
          value: 'external',
        },
        {
          label: 'Internal page',
          value: 'internal',
        },
      ],
      required: true,
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External link',
      admin: {
        condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
      },
      validate: (value: unknown, { siblingData }: { siblingData: EventLinkSiblingData }) => {
        if (siblingData?.linkType === 'internal') return true
        return value ? true : 'External link is required.'
      },
    },
    {
      name: 'internalPage',
      type: 'relationship',
      admin: {
        condition: (_data, siblingData) => siblingData?.linkType === 'internal',
      },
      label: 'Internal page',
      relationTo: 'pages',
      validate: (value: unknown, { siblingData }: { siblingData: EventLinkSiblingData }) => {
        if (siblingData?.linkType !== 'internal') return true
        return value ? true : 'Internal page is required.'
      },
    },
  ],
  hooks: {
    afterChange: [revalidateEventAfterChange],
    afterDelete: [revalidateEventAfterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
