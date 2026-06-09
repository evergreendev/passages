import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Event } from '@/payload-types'

const revalidateHome = ({
  context,
  payload,
  url,
}: {
  context: Parameters<CollectionAfterChangeHook<Event>>[0]['req']['context']
  payload: Parameters<CollectionAfterChangeHook<Event>>[0]['req']['payload']
  url?: string
}) => {
  const isAdminRequest = url?.includes('/admin')

  if (!context.disableRevalidate && !isAdminRequest) {
    payload.logger.info('Revalidating home page after event change')
    revalidatePath('/')
  }
}

export const revalidateEventAfterChange: CollectionAfterChangeHook<Event> = ({ doc, req }) => {
  revalidateHome(req)
  return doc
}

export const revalidateEventAfterDelete: CollectionAfterDeleteHook<Event> = ({ doc, req }) => {
  revalidateHome(req)
  return doc
}
