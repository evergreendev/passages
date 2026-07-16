const stripePaymentIntentsURL = 'https://api.stripe.com/v1/payment_intents'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minimumAmountCents = 100
const maximumAmountCents = 10000000

type PaymentIntentRequest = {
  amountCents?: unknown
  donationEmail?: unknown
  donorEmail?: unknown
  name?: unknown
  remembranceMessage?: unknown
  supportDesignation?: unknown
}

const append = (params: URLSearchParams, key: string, value: string | number) => {
  params.append(key, String(value))
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe is not configured.' }, { status: 500 })
  }

  let body: PaymentIntentRequest

  try {
    body = (await request.json()) as PaymentIntentRequest
  } catch {
    return Response.json({ error: 'Invalid payment request.' }, { status: 400 })
  }

  const amountCents = Number(body.amountCents)
  const donorEmail = typeof body.donorEmail === 'string' ? body.donorEmail.trim() : ''
  const donationEmail = typeof body.donationEmail === 'string' ? body.donationEmail.trim() : ''
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Donation'
  const remembranceMessage =
    typeof body.remembranceMessage === 'string' ? body.remembranceMessage.trim() : ''
  const supportDesignation =
    typeof body.supportDesignation === 'string' ? body.supportDesignation.trim() : ''

  if (!Number.isInteger(amountCents)) {
    return Response.json(
      { error: 'Donation amount must be a whole number of cents.' },
      { status: 400 },
    )
  }

  if (amountCents < minimumAmountCents) {
    return Response.json({ error: 'Donation amount must be at least $1.' }, { status: 400 })
  }

  if (amountCents > maximumAmountCents) {
    return Response.json({ error: 'Donation amount is too large.' }, { status: 400 })
  }

  if (!emailPattern.test(donorEmail)) {
    return Response.json(
      { error: 'Enter a valid email address for your receipt.' },
      { status: 400 },
    )
  }

  if (!emailPattern.test(donationEmail)) {
    return Response.json(
      { error: 'Donation destination email is not configured correctly.' },
      { status: 400 },
    )
  }

  if (!supportDesignation) {
    return Response.json(
      { error: 'Choose what you would like your donation to support.' },
      { status: 400 },
    )
  }

  if (supportDesignation.length > 500 || remembranceMessage.length > 500) {
    return Response.json({ error: 'Additional donation information is too long.' }, { status: 400 })
  }

  const params = new URLSearchParams()

  append(params, 'amount', amountCents)
  append(params, 'currency', 'usd')
  append(params, 'description', name)
  append(params, 'receipt_email', donorEmail)
  append(params, 'payment_method_types[]', 'card')
  append(params, 'metadata[donor_email]', donorEmail)
  append(params, 'metadata[donation_email]', donationEmail)
  append(params, 'metadata[remembrance_message]', remembranceMessage)
  append(params, 'metadata[support_designation]', supportDesignation)

  const stripeResponse = await fetch(stripePaymentIntentsURL, {
    body: params,
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const stripeData = (await stripeResponse.json()) as {
    client_secret?: string
    error?: { message?: string }
    id?: string
  }

  if (!stripeResponse.ok || !stripeData.client_secret) {
    return Response.json(
      { error: stripeData.error?.message || 'Unable to create Stripe payment.' },
      { status: 502 },
    )
  }

  return Response.json({
    clientSecret: stripeData.client_secret,
    paymentIntentID: stripeData.id,
  })
}
