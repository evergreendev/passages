import type { DonationBlock as DonationBlockProps } from '@/payload-types'

import { DonationForm } from './Component.client'

export const DonationBlock: React.FC<DonationBlockProps> = (props) => {
  return <DonationForm {...props} />
}
