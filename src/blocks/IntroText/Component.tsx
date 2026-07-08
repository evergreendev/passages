import type { IntroTextBlock as IntroTextBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'

export const IntroTextBlock: React.FC<IntroTextBlockProps> = ({ content }) => {
  return (
    <section className="bg-[#dbecef] py-16 text-[#1f3b95]">
      <div className="container">
        <div className="mx-auto max-w-2xl text-lg leading-snug">
          <RichText data={content} enableGutter={false} />
        </div>
      </div>
    </section>
  )
}
