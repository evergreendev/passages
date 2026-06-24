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
    <section className="relative min-h-[680px] bg-passages-mist 2xl:aspect-video w-full 2xl:min-h-0 2xl:max-h-[900px]">
      <Media
        fill
        imgClassName="object-cover object-[60%_center]"
        priority
        resource={backgroundImage}
        size="100vw"
      />
      <div className="absolute inset-0 bg-white/15" />

      <div className="relative z-50 flex flex-col justify-end 2xl:absolute 2xl:inset-0 2xl:min-h-0">
        <div className="flex min-h-0 flex-1 flex-col justify-between py-6 md:py-8">
          <div className="grid grid-cols-4 gap-x-16 gap-y-0 2xl:grid-cols-12 ">
            {logo && typeof logo === 'object' ? (
              <div className="col-span-4 xl:col-span-5 xl:col-start-4">
                <Media
                  className="relative h-45 w-full max-w-84 md:h-60 xl:h-80 md:-translate-y-20"
                  fill
                  imgClassName="object-contain object-left-top"
                  pictureClassName="block h-full w-full"
                  resource={logo}
                  size="340px"
                />
              </div>
            ) : null}
          </div>

          {event ? (
            <div className="grid grid-cols-4 gap-x-16 gap-y-8 2xl:grid-cols-12">
              <div className="col-span-4 md:col-span-6 xl:col-span-4 2xl:col-start-3">
                <div className="rounded-xl border-2 border-passages-blue/35 bg-white/55 px-6 py-5 text-center text-passages-blue shadow-sm backdrop-blur-[2px] md:px-8">
                  <p className="text-3xl font-extrabold uppercase leading-none md:text-6xl">
                    {event.title}
                  </p>
                  <p className="mt-2 text-xl font-normal leading-tight md:text-4xl">
                    {formatEventDate(event.startDate)}
                  </p>
                  <Link
                    className="mt-3 inline-block text-xl font-bold italic underline underline-offset-2 md:text-3xl"
                    href={event.externalLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Reserve Your Seat!
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-passages-blue/90 py-8 text-white backdrop-blur-[1px] 2xl:w-[56%]">
          <div className="container">
            <div className="grid grid-cols-4 gap-x-16 gap-y-8 xl:grid-cols-12">
              <div className="col-span-4 xl:col-span-12">
                <h1 className="text-center font-serif text-4xl font-normal leading-tight md:text-5xl xl:text-6xl">
                  {headline}
                </h1>
                {actions?.length ? (
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {actions.map((action) => (
                      <CMSLink
                        key={action.id}
                        {...action.link}
                        appearance="inline"
                        className={cn(
                          'inline-flex min-h-10 xl:min-h-20 min-w-52 items-center justify-center rounded-md px-7 xl:text-3xl font-bold',
                          actionClasses[action.style || 'green'],
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
