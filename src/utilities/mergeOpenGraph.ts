import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    "Passages Women's Transitional Living helps women move toward stability, purpose, and independence.",
  images: [
    {
      url: `${getServerSideURL()}/website-cover.webp`,
    },
  ],
  siteName: 'Passages',
  title: 'Passages',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
