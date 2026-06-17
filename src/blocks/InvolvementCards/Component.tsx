import type { InvolvementCardsBlock as InvolvementCardsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Bed, Heart, Mail, Phone, Users } from 'lucide-react'
import { cn } from '@/utilities/ui'

const icons = {
  bed: Bed,
  heart: Heart,
  mail: Mail,
  people: Users,
  phone: Phone,
}

const buttonClasses = {
  blue: 'bg-[#273f98] hover:bg-[#20337c]',
  green: 'bg-[#98c844] hover:bg-[#86b536]',
}

export const InvolvementCardsBlock: React.FC<InvolvementCardsBlockProps> = ({ cards, heading }) => {
  return (
    <section className="bg-[#dbecef] py-16 text-[#273f98]">
      <div className="container">
        <h2 className="text-center font-serif text-4xl md:text-4xl">{heading}</h2>

        {cards?.length ? (
          <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = icons[card.icon || 'heart']

              return (
                <article
                  className="relative flex min-h-[330px] flex-col rounded-md bg-white px-7 pb-8 pt-14 text-center"
                  key={card.id}
                >
                  <div className="absolute left-1/2 top-0 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#98c844] bg-white">
                    <Icon aria-hidden className="size-12 stroke-[#273f98] stroke-[2.2]" />
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl">{card.title}</h3>
                  <p className="mt-5 text-lg font-medium leading-tight">{card.description}</p>
                  <div className="mt-auto pt-8">
                    <CMSLink
                      {...card.link}
                      appearance="inline"
                      className={cn(
                        'inline-flex min-h-11 items-center justify-center rounded-md px-8 text-lg font-bold text-white',
                        buttonClasses[card.buttonStyle || 'blue'],
                      )}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
