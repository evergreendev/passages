import clsx from 'clsx'
import React from 'react'

import type { Media as MediaType, SiteSetting } from '@/payload-types'

import { Media } from '@/components/Media'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  siteSettings?: SiteSetting | null
}

export const Logo = (props: Props) => {
  const { className, loading: loadingFromProps, priority: priorityFromProps, siteSettings } = props

  const logo = siteSettings?.logo
  const siteTitle = siteSettings?.siteTitle || 'Passages'
  const siteDescription = siteSettings?.siteDescription || "Women's Transitional Living"
  const priority = priorityFromProps === 'high'
  const loading = loadingFromProps || 'lazy'

  if (logo && typeof logo === 'object') {
    return (
      <span
        aria-label={`${siteTitle}${siteDescription ? ` - ${siteDescription}` : ''}`}
        className={clsx('block w-[12.5rem] sm:w-[14.5rem]', className)}
      >
        <Media
          htmlElement={null}
          imgClassName="h-auto w-full object-contain"
          loading={loading}
          priority={priority}
          resource={logo as MediaType}
          size="14.5rem"
        />
      </span>
    )
  }

  return (
    <span
      aria-label={`${siteTitle}${siteDescription ? ` - ${siteDescription}` : ''}`}
      className={clsx('flex w-[12.5rem] flex-col text-passages-blue sm:w-[14.5rem]', className)}
    >
      <svg aria-hidden="true" className="mb-1 h-auto w-[7.25rem] sm:w-[8.5rem]" viewBox="0 0 220 156">
        <path
          d="M24 110c26-36 70-39 116-10 21 13 42 10 68-2 8-4 16 9 6 14-38 19-76 30-120 12-24-10-50-11-70-4-7 2-13-4-9-10Z"
          fill="currentColor"
        />
        <path
          d="M101 13c-14 25-29 48-52 58-9-15-18-36-21-58 21 22 42 18 73 0Z"
          fill="currentColor"
        />
        <circle cx="64" cy="23" fill="currentColor" r="17" />
        <g className="text-passages-green">
          <path
            d="M132 13c14 25 29 48 52 58 9-15 18-36 21-58-21 22-42 18-73 0Z"
            fill="currentColor"
          />
          <circle cx="168" cy="23" fill="currentColor" r="17" />
        </g>
        <path
          className="text-passages-cyan"
          d="M7 117c31-28 69-30 111-11 20 9 39 7 67-8 8-4 18 8 8 14-38 23-76 33-119 17-25-9-49-8-67 1-7 4-13-8 0-13Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-sans text-[2.35rem] font-black uppercase leading-none tracking-normal sm:text-[2.8rem]">
        {siteTitle}
      </span>
      <span className="font-sans text-[0.6rem] font-semibold uppercase leading-none tracking-normal sm:text-[0.72rem]">
        {siteDescription}
      </span>
    </span>
  )
}
