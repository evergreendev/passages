import type { ProgramOverviewBlock as ProgramOverviewBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Briefcase, Church, HeartPulse, Home, Users } from 'lucide-react'

const icons = {
  employment: Briefcase,
  lifeSkills: Home,
  physicalHealth: HeartPulse,
  relationships: Users,
  spiritualGrowth: Church,
}

export const ProgramOverviewBlock: React.FC<ProgramOverviewBlockProps> = ({
  areas,
  content,
  heading,
  link,
}) => {
  return (
    <section className="bg-[#f3f7f8] py-16 text-[#1f3b95]">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl leading-tight md:text-4xl">{heading}</h2>
          <div className="mt-7 text-lg font-medium leading-snug">
            <RichText data={content} enableGutter={false} />
          </div>

          {areas?.length ? (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-lg font-extrabold text-[#00a8c8]">
              {areas.map((area) => {
                const Icon = icons[area.icon || 'lifeSkills']

                return (
                  <div className="inline-flex items-center gap-2" key={area.id}>
                    <Icon aria-hidden className="size-6 stroke-[2.4]" />
                    <span>{area.label}</span>
                  </div>
                )
              })}
            </div>
          ) : null}

          {link ? (
            <div className="mt-12 flex justify-center">
              <CMSLink
                {...link}
                appearance="inline"
                className="inline-flex min-h-14 min-w-52 items-center justify-center rounded-md bg-[#98c844] px-8 text-lg font-bold text-white hover:bg-[#86b536]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
