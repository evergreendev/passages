import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { revalidateEventAfterChange, revalidateEventAfterDelete } from './hooks/revalidateEvent'

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
    startDate: true,
    externalLink: true,
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
      name: 'externalLink',
      type: 'text',
      label: 'External link',
      required: true,
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
