import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactBandBlock } from '@/blocks/ContactBand/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { IntroTextBlock } from '@/blocks/IntroText/Component'
import { InvolvementCardsBlock } from '@/blocks/InvolvementCards/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PassagesHeroBlock } from '@/blocks/PassagesHero/Component'
import { ProgramOverviewBlock } from '@/blocks/ProgramOverview/Component'

const blockComponents = {
  archive: ArchiveBlock,
  contactBand: ContactBandBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  introText: IntroTextBlock,
  involvementCards: InvolvementCardsBlock,
  mediaBlock: MediaBlock,
  passagesHero: PassagesHeroBlock,
  programOverview: ProgramOverviewBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <Fragment key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
