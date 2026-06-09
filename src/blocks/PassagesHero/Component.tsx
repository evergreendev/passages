import type { PassagesHeroBlock as PassagesHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const actionClasses = {
  blue: 'bg-[#273f98] text-white hover:bg-[#20337c]',
  green: 'bg-[#98c844] text-white hover:bg-[#86b536]',
  outline: 'border-2 border-white bg-transparent text-white hover:bg-white/10',
}

export const PassagesHeroBlock: React.FC<PassagesHeroBlockProps> = ({
  actions,
  backgroundImage,
  event,
  headline,
  logo,
}) => {
  return (
    <section className="relative -mt-16 min-h-[680px] overflow-hidden bg-[#d9e8eb]">
      <Media
        fill
        imgClassName="object-cover object-center"
        priority
        resource={backgroundImage}
        size="100vw"
      />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 flex min-h-[680px] flex-col justify-end">
        <div className="container flex flex-1 flex-col justify-center pb-12 pt-28">
          {logo && typeof logo === 'object' ? (
            <Media
              imgClassName="h-auto w-[280px] max-w-[75vw]"
              pictureClassName="block"
              resource={logo}
              size="320px"
            />
          ) : null}
        </div>

        <div className="bg-white/45 py-5 text-[#273f98] backdrop-blur-[2px]">
          <div className="container">
            <p className="text-3xl font-extrabold uppercase leading-none md:text-4xl">
              {event?.title}
            </p>
            <p className="mt-1 text-xl font-bold md:text-2xl">{event?.dateText}</p>
            {event?.link ? (
              <CMSLink
                {...event.link}
                appearance="inline"
                className="mt-3 inline-block text-xl font-medium italic underline md:ml-72 md:text-2xl"
              />
            ) : null}
          </div>
        </div>

        <div className="bg-[#1f3b95]/85 py-8 text-white">
          <div className="container">
            <h1 className="max-w-4xl font-serif text-3xl leading-tight md:text-5xl">{headline}</h1>
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
