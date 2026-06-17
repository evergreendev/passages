'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const logo = data?.logo

  return (
    <header className="relative z-20 w-full bg-white">
      <div className="container flex flex-col gap-5 py-4 md:flex-row md:items-start md:justify-between md:gap-8">
        {!isHomePage && (
          <Link className="shrink-0" href="/">
            {logo && typeof logo === 'object' ? (
              <Media
                imgClassName="h-auto max-h-20 w-[12.5rem] object-contain sm:w-[14.5rem]"
                loading="eager"
                pictureClassName="block"
                priority
                resource={logo}
                size="14.5rem"
              />
            ) : (
              <Logo loading="eager" priority="high" />
            )}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-4 md:ml-auto md:justify-end">
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
