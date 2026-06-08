'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  siteSettings?: SiteSetting | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <header className="relative z-20 w-full bg-white">
      <div className="container flex flex-col gap-5 py-4 md:flex-row md:items-start md:justify-between md:gap-8">
        {!isHomePage && (
          <Link className="shrink-0" href="/">
            <Logo loading="eager" priority="high" siteSettings={siteSettings} />
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-4 md:ml-auto md:justify-end">
          <HeaderNav data={data} />
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 min-w-36 items-center justify-center rounded-md bg-passages-blue px-7 text-sm font-bold uppercase tracking-normal text-white transition-colors hover:bg-passages-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-passages-cyan"
              href="/donate"
            >
              Donate
            </Link>
            <Link
              className="inline-flex h-11 min-w-44 items-center justify-center rounded-md bg-passages-green px-7 text-sm font-bold uppercase tracking-normal text-white transition-colors hover:bg-passages-green-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-passages-cyan"
              href="/apply-for-help"
            >
              Apply for Help
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
