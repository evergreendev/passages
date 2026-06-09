import type { ContactBandBlock as ContactBandBlockProps } from '@/payload-types'

import { Mail, Phone } from 'lucide-react'

const icons = {
  mail: Mail,
  phone: Phone,
}

export const ContactBandBlock: React.FC<ContactBandBlockProps> = ({ items }) => {
  return (
    <section className="bg-[#1f3b95] py-12 text-white">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center md:justify-center md:gap-20">
          {items.map((item, index) => {
            const Icon = icons[item.icon || 'mail']

            return (
              <div
                className="flex items-center gap-7 md:border-l md:border-white/60 md:first:border-l-0 md:first:pl-0 md:[&:not(:first-child)]:pl-20"
                key={item.id}
              >
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-white">
                  <Icon aria-hidden className="size-12 stroke-[#273f98] stroke-[2.2]" />
                </div>
                <div className="text-2xl leading-tight">
                  <p className="mb-3 text-xl font-extrabold text-[#98c844]">{item.label}</p>
                  {item.lines?.map((line) => (
                    <p key={line.id}>{line.text}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
