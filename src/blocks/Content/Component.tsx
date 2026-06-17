import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  } as const

  const lgColStartClasses: Record<number, string> = {
    2: 'lg:col-start-2',
    3: 'lg:col-start-3',
    4: 'lg:col-start-4',
    5: 'lg:col-start-5',
  }

  const mdColStartClasses: Record<number, string> = {
    2: 'md:col-start-2',
  }

  const lgColumnStarts = getCenteredColumnStarts(columns, 12, (size) =>
    Number(colsSpanClasses[size]),
  )
  const mdColumnStarts = getCenteredColumnStarts(columns, 4, (size) => (size === 'full' ? 4 : 2))

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16 content-center">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText } = col
            const size = col.size ?? 'oneThird'

            return (
              <div
                className={cn(
                  `col-span-4 lg:col-span-${colsSpanClasses[size]}`,
                  mdColStartClasses[mdColumnStarts[index]],
                  lgColStartClasses[lgColumnStarts[index]],
                  {
                    'md:col-span-2': size !== 'full',
                  },
                )}
                key={index}
              >
                {richText && <RichText data={richText} className={"prose-h2:text-4xl prose-h2:font-normal"} enableGutter={false} enableProse={true} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}

type ContentColumn = NonNullable<ContentBlockProps['columns']>[number]
type ColumnSize = NonNullable<ContentColumn['size']>

const getCenteredColumnStarts = (
  columns: ContentBlockProps['columns'],
  gridColumns: number,
  getSpan: (size: ColumnSize) => number,
) => {
  const starts: Record<number, number> = {}
  const rows: { index: number; span: number }[][] = []

  columns?.forEach((column, index) => {
    const size = column.size ?? 'oneThird'
    const span = getSpan(size)
    const currentRow = rows[rows.length - 1]
    const currentSpan = currentRow?.reduce((total, item) => total + item.span, 0) ?? 0

    if (!currentRow || currentSpan + span > gridColumns) {
      rows.push([{ index, span }])
      return
    }

    currentRow.push({ index, span })
  })

  rows.forEach((row) => {
    const rowSpan = row.reduce((total, item) => total + item.span, 0)
    const remainingColumns = gridColumns - rowSpan

    if (remainingColumns > 0) {
      starts[row[0].index] = remainingColumns / 2 + 1
    }
  })

  return starts
}
