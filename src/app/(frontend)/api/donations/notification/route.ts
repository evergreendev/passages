import config from '@payload-config'
import { getPayload } from 'payload'

const stripePaymentIntentURL = 'https://api.stripe.com/v1/payment_intents'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type NotificationRequest = {
  paymentIntentID?: unknown
}

type StripePaymentIntent = {
  amount?: number
  currency?: string
  description?: string
  id?: string
  metadata?: {
    donation_email?: string
    donor_email?: string
    notification_sent?: string
    remembrance_message?: string
    support_designation?: string
  }
  status?: string
}

const escapeHTML = (value: string | number | null | undefined) =>
  String(value ?? 'Not provided')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const formatAmount = (amount: number | undefined, currency: string | undefined) =>
  new Intl.NumberFormat('en-US', {
    currency: currency?.toUpperCase() || 'USD',
    style: 'currency',
  }).format((amount || 0) / 100)

const updateNotificationSent = async (paymentIntentID: string, stripeSecretKey: string) => {
  const params = new URLSearchParams()
  params.append('metadata[notification_sent]', 'true')

  const response = await fetch(`${stripePaymentIntentURL}/${encodeURIComponent(paymentIntentID)}`, {
    body: params,
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Unable to update donation notification metadata.')
  }
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const smtpPassword =
    process.env.SMTP_PASS || process.env.MANDRILL_KEY || process.env.MANDRILL_API_KEY

  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe is not configured.' }, { status: 500 })
  }

  if (!process.env.SMTP_USER || !smtpPassword) {
    return Response.json({ error: 'SMTP email is not configured.' }, { status: 500 })
  }

  let body: NotificationRequest

  try {
    body = (await request.json()) as NotificationRequest
  } catch {
    return Response.json({ error: 'Invalid notification request.' }, { status: 400 })
  }

  const paymentIntentID =
    typeof body.paymentIntentID === 'string' ? body.paymentIntentID.trim() : ''

  if (!paymentIntentID.startsWith('pi_')) {
    return Response.json({ error: 'Invalid payment reference.' }, { status: 400 })
  }

  const stripeResponse = await fetch(
    `${stripePaymentIntentURL}/${encodeURIComponent(paymentIntentID)}`,
    {
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      method: 'GET',
    },
  )

  const paymentIntent = (await stripeResponse.json()) as StripePaymentIntent & {
    error?: { message?: string }
  }

  if (!stripeResponse.ok) {
    return Response.json(
      { error: paymentIntent.error?.message || 'Unable to verify donation.' },
      { status: 502 },
    )
  }

  if (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'processing') {
    return Response.json({ error: 'Donation payment is not complete.' }, { status: 409 })
  }

  if (paymentIntent.metadata?.notification_sent === 'true') {
    return Response.json({ notified: false })
  }

  const donationEmail = paymentIntent.metadata?.donation_email?.trim() || ''
  const donorEmail = paymentIntent.metadata?.donor_email?.trim() || ''
  const remembranceMessage = paymentIntent.metadata?.remembrance_message?.trim() || ''
  const supportDesignation = paymentIntent.metadata?.support_designation?.trim() || ''

  if (!emailPattern.test(donationEmail)) {
    return Response.json({ error: 'Donation notification email is invalid.' }, { status: 400 })
  }

  if (!emailPattern.test(donorEmail)) {
    return Response.json({ error: 'Donor notification email is invalid.' }, { status: 400 })
  }

  const amount = formatAmount(paymentIntent.amount, paymentIntent.currency)
  const adminRows = [
    ['Amount', amount],
    ['Donor email', donorEmail || 'Not provided'],
    ['Donation supports', supportDesignation || 'Not provided'],
    ['In remembrance of', remembranceMessage || 'Not provided'],
    ['Stripe PaymentIntent', paymentIntent.id || paymentIntentID],
    ['Status', paymentIntent.status || 'Not provided'],
  ]
  const donorRows = [
    ['Amount', amount],
    ['Donation supports', supportDesignation || 'Not provided'],
    ['In remembrance of', remembranceMessage || 'Not provided'],
  ]
  const buildHTMLRows = (rows: string[][]) =>
    rows
      .map(
        ([label, value]) =>
          `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(label)}</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(value)}</td></tr>`,
      )
      .join('')
  const buildTextRows = (rows: string[][]) =>
    rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const adminHTMLRows = buildHTMLRows(adminRows)
  const donorHTMLRows = buildHTMLRows(donorRows)
  const adminText = buildTextRows(adminRows)
  const donorText = buildTextRows(donorRows)
  const payload = await getPayload({ config })

  await payload.sendEmail({
    html: `
      <p>A donation form was successfully submitted.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${adminHTMLRows}
      </table>
    `,
    subject: `New donation: ${amount}`,
    text: `A donation form was successfully submitted.\n\n${adminText}`,
    to: donationEmail,
  })

  await payload.sendEmail({
    html: `
      <p>Thank you for your donation.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${donorHTMLRows}
      </table>
    `,
    subject: `Thank you for your donation`,
    text: `Thank you for your donation.\n\n${donorText}`,
    to: donorEmail,
  })

  await updateNotificationSent(paymentIntentID, stripeSecretKey)

  return Response.json({ notified: true })
}
