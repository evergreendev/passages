import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import RichText from '@/components/RichText'
import { Mail, Phone } from 'lucide-react'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  return (
    <footer className="mt-auto bg-[#dbecef] py-12">
      <div className="bg-[#1f3b95] px-6 py-8 text-white md:px-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-center md:justify-center md:gap-16">
          <div className="flex items-center gap-7">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white md:size-24">
              <Mail aria-hidden className="size-10 stroke-[#273f98] stroke-[2.2] md:size-12" />
            </div>
            <div className="text-xl leading-tight md:text-2xl">
              <p className="mb-2 text-lg font-extrabold text-[#98c844] md:text-xl">
                Mail donations to:
              </p>
              {footerData?.address ? (
                <RichText
                  className="prose-p:m-0 prose-p:text-white prose-p:leading-tight"
                  data={footerData.address}
                  enableGutter={false}
                />
              ) : null}
            </div>
          </div>

          <div className="hidden h-24 w-px bg-white/70 md:block" />

          <div className="flex items-center gap-7">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white md:size-24">
              <Phone aria-hidden className="size-10 stroke-[#273f98] stroke-[2.2] md:size-12" />
            </div>
            <div className="text-xl leading-tight md:text-2xl">
              <p className="mb-2 text-lg font-extrabold text-[#98c844] md:text-xl">Questions?</p>
              <p>{footerData?.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
