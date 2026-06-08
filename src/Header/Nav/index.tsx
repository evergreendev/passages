'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            className="text-base font-bold text-passages-blue no-underline hover:text-passages-cyan sm:text-lg"
            key={i}
            {...link}
            appearance="link"
          />
        )
      })}
    </nav>
  )
}
