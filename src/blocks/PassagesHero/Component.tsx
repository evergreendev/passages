import type { PassagesHeroBlock as PassagesHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

const actionClasses = {
  blue: 'bg-[#273f98] text-white hover:bg-[#20337c]',
  green: 'bg-[#98c844] text-white hover:bg-[#86b536]',
  outline: 'border-2 border-white bg-transparent text-white hover:bg-white/10',
}

const formatEventDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Denver',
    weekday: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const getUpcomingEvent = async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    depth: 0,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    sort: 'startDate',
    where: {
      startDate: {
        greater_than_equal: new Date().toISOString(),
      },
    },
  })

  return result.docs[0] || null
}

export const PassagesHeroBlock = async ({
  actions,
  backgroundImage,
  headline,
  logo,
}: PassagesHeroBlockProps) => {
  const event = await getUpcomingEvent()

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[#d9e8eb] lg:aspect-[1400/680] lg:min-h-0">
      <Media
        fill
        imgClassName="object-cover object-center"
        priority
        resource={backgroundImage}
        size="100vw"
      />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 flex min-h-[680px] flex-col justify-end lg:absolute lg:inset-0 lg:min-h-0">
        <div className="absolute left-8 top-4 md:left-16 md:top-6">
          {logo && typeof logo === 'object' ? (
            <Media
              imgClassName="h-auto w-[280px] max-w-[75vw]"
              pictureClassName="block"
              resource={logo}
              size="320px"
            />
          ) : null}
        </div>

        <div className="flex-1" />

        {event ? (
          <div className="w-full bg-white/55 py-5 pl-4 pr-8 text-[#273f98] backdrop-blur-[2px] md:w-[60%] md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="text-3xl font-extrabold uppercase leading-none md:text-4xl">
              {event.title}
            </p>
            <p className="mt-1 text-xl font-bold md:text-2xl">{formatEventDate(event.startDate)}</p>
            <Link
              className="mt-3 inline-block text-xl font-medium italic underline md:ml-72 md:text-2xl"
              href={event.externalLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Reserve your seat
            </Link>
          </div>
        ) : null}

        <div className="w-full bg-linear-to-r from-[#1f3b95]/90 from-0% via-[#1f3b95]/85 via-80% to-transparent to-100% py-8 pl-4 pr-[18vw] text-white md:w-2/3 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <div className="max-w-4xl">
            <h1 className="font-serif text-3xl leading-tight md:text-4xl">{headline}</h1>
            {actions?.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <CMSLink
                    key={action.id}
                    {...action.link}
                    appearance="inline"
                    className={cn(
                      'inline-flex min-h-14 items-center justify-center rounded-md px-7 text-lg font-bold',
                      actionClasses[action.style || 'green'],
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
