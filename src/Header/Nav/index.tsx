'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

const ctaLinkClasses = {
  blue: 'min-w-36 bg-passages-blue hover:bg-passages-blue-deep',
  green: 'min-w-44 bg-passages-green hover:bg-passages-green-deep',
} satisfies Record<NonNullable<HeaderType['ctaLinks']>[number]['style'], string>

const baseCtaLinkClassName =
  'inline-flex h-11 items-center justify-center rounded-md px-7 text-sm font-bold uppercase tracking-normal text-white no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-passages-cyan'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const ctaLinks = data?.ctaLinks || []

  return (
    <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
      {navItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
          {navItems.map(({ id, link }, i) => {
            return (
              <CMSLink
                className="text-base font-bold text-passages-blue no-underline hover:text-passages-cyan sm:text-lg"
                key={id || i}
                {...link}
                appearance="link"
              />
            )
          })}
        </div>
      )}
      {ctaLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {ctaLinks.map(({ id, link, style }, i) => {
            return (
              <CMSLink
                appearance="inline"
                className={cn(baseCtaLinkClassName, ctaLinkClasses[style])}
                key={id || i}
                {...link}
              />
            )
          })}
        </div>
      )}
    </nav>
  )
}
