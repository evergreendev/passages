'use client'

import type { DonationBlock as DonationBlockProps } from '@/payload-types'

import { CreditCard, HeartHandshake } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'

type StripeCardElement = {
  mount: (selector: string) => void
  on: (event: 'change', handler: (event: { error?: { message?: string } }) => void) => void
  unmount: () => void
}

type StripeElements = {
  create: (
    type: 'card',
    options?: {
      hidePostalCode?: boolean
      style?: Record<string, unknown>
    },
  ) => StripeCardElement
}

type StripeInstance = {
  confirmCardPayment: (
    clientSecret: string,
    data: {
      payment_method: {
        billing_details: {
          email: string
        }
        card: StripeCardElement
      }
    },
  ) => Promise<{
    error?: { message?: string }
    paymentIntent?: { status?: string }
  }>
  elements: () => StripeElements
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance | null
  }
}

const stripeScriptID = 'stripe-js-v3'
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

const dollarsToCents = (value: number) => Math.round(value * 100)

const loadStripeScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Stripe) {
      resolve()
      return
    }

    const existingScript = document.getElementById(stripeScriptID) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Stripe.')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = stripeScriptID
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Unable to load Stripe.')), {
      once: true,
    })
    document.head.appendChild(script)
  })

export const DonationForm: React.FC<DonationBlockProps> = ({
  buttonLabel,
  description,
  donationEmail,
  heading,
  presetAmounts,
}) => {
  const cardElementRef = useRef<StripeCardElement | null>(null)
  const stripeRef = useRef<StripeInstance | null>(null)
  const [cardReady, setCardReady] = useState(false)

  const amounts = useMemo(
    () =>
      (presetAmounts || [])
        .map((item) => Number(item.amount))
        .filter((amount) => Number.isFinite(amount) && amount > 0),
    [presetAmounts],
  )

  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(amounts[0] || 25)
  const [customAmount, setCustomAmount] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeAmount =
    selectedAmount === 'custom' ? Number.parseFloat(customAmount) : Number(selectedAmount)

  useEffect(() => {
    let isMounted = true

    const setupStripe = async () => {
      if (!stripePublishableKey) {
        setError('Stripe publishable key is not configured.')
        return
      }

      try {
        await loadStripeScript()

        if (!isMounted || !window.Stripe) return

        const stripe = window.Stripe(stripePublishableKey)

        if (!stripe) {
          setError('Unable to initialize Stripe.')
          return
        }

        const elements = stripe.elements()
        const card = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              color: '#203898',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              '::placeholder': {
                color: '#385080',
              },
            },
            invalid: {
              color: '#b64034',
            },
          },
        })

        stripeRef.current = stripe
        cardElementRef.current = card
        card.on('change', (event) => {
          setError(event.error?.message)
        })
        card.mount('#donation-card-element')
        setCardReady(true)
      } catch (err) {
        console.warn(err)
        setError('Unable to load Stripe. Please refresh and try again.')
      }
    }

    void setupStripe()

    return () => {
      isMounted = false
      cardElementRef.current?.unmount()
      cardElementRef.current = null
      stripeRef.current = null
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    setSuccess(undefined)

    if (!Number.isFinite(activeAmount) || activeAmount < 1) {
      setError('Enter a donation amount of at least $1.')
      return
    }

    if (!email.trim()) {
      setError('Enter an email address for your receipt.')
      return
    }

    if (!stripeRef.current || !cardElementRef.current || !cardReady) {
      setError('Stripe is still loading. Please try again in a moment.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/donations/payment-intent', {
        body: JSON.stringify({
          amountCents: dollarsToCents(activeAmount),
          donorEmail: email,
          donationEmail,
          name: heading,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = (await response.json()) as { clientSecret?: string; error?: string }

      if (!response.ok || !data.clientSecret) {
        setError(data.error || 'Unable to start payment. Please try again.')
        setIsSubmitting(false)
        return
      }

      const result = await stripeRef.current.confirmCardPayment(data.clientSecret, {
        payment_method: {
          billing_details: {
            email,
          },
          card: cardElementRef.current,
        },
      })

      if (result.error) {
        setError(result.error.message || 'Unable to complete payment.')
        setIsSubmitting(false)
        return
      }

      if (result.paymentIntent?.status === 'succeeded') {
        setSuccess('Thank you. Your donation was received.')
        setEmail('')
        setCustomAmount('')
      } else {
        setSuccess('Thank you. Stripe is processing your donation.')
      }
    } catch (err) {
      console.warn(err)
      setError('Unable to complete payment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-passages-sky py-16 text-passages-blue">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)] lg:items-center">
          <div>
            <div className="mb-7 flex size-20 items-center justify-center rounded-full bg-white text-passages-green shadow-sm">
              <HeartHandshake aria-hidden className="size-11" strokeWidth={2.2} />
            </div>
            <h2 className="font-serif text-4xl leading-none md:text-5xl">{heading}</h2>
            {description ? (
              <p className="mt-5 max-w-xl text-lg font-medium leading-snug text-passages-slate">
                {description}
              </p>
            ) : null}
          </div>

          <form
            className="rounded-md border border-border bg-white p-5 shadow-sm md:p-7"
            onSubmit={handleSubmit}
          >
            <fieldset disabled={isSubmitting}>
              <legend className="mb-4 text-lg font-extrabold text-passages-blue">
                Choose an amount
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {amounts.map((amount, index) => (
                  <button
                    className={cn(
                      'min-h-12 rounded-md border px-3 text-lg font-extrabold transition-colors',
                      selectedAmount === amount
                        ? 'border-passages-blue bg-passages-blue text-white'
                        : 'border-border bg-white text-passages-blue hover:border-passages-cyan',
                    )}
                    key={`${amount}-${index}`}
                    onClick={() => setSelectedAmount(amount)}
                    type="button"
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  className={cn(
                    'min-h-12 rounded-md border px-3 text-lg font-extrabold transition-colors',
                    selectedAmount === 'custom'
                      ? 'border-passages-blue bg-passages-blue text-white'
                      : 'border-border bg-white text-passages-blue hover:border-passages-cyan',
                  )}
                  onClick={() => setSelectedAmount('custom')}
                  type="button"
                >
                  Custom
                </button>
              </div>

              {selectedAmount === 'custom' ? (
                <div className="mt-5">
                  <Label htmlFor="donation-custom-amount">Donation amount</Label>
                  <div className="mt-2 flex items-center rounded-md border border-input bg-white focus-within:ring-4 focus-within:ring-ring/10 focus-within:outline-1 focus-within:outline-ring/50">
                    <span className="px-3 text-lg font-bold text-passages-slate">$</span>
                    <Input
                      className="h-12 border-0 px-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:outline-none"
                      id="donation-custom-amount"
                      inputMode="decimal"
                      min="1"
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="100"
                      step="0.01"
                      type="number"
                      value={customAmount}
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                <Label htmlFor="donation-email">Email for receipt</Label>
                <Input
                  className="mt-2 h-12 text-base"
                  id="donation-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="mt-5">
                <Label>Card details</Label>
                <div
                  className="mt-2 min-h-12 rounded-md border border-input bg-white px-3 py-3 shadow-xs"
                  id="donation-card-element"
                />
              </div>

              {error ? (
                <p className="mt-4 rounded-md border border-error bg-error/10 px-3 py-2 text-sm font-medium text-error">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="mt-4 rounded-md border border-success bg-success/10 px-3 py-2 text-sm font-medium text-passages-forest">
                  {success}
                </p>
              ) : null}

              <Button
                className="mt-6 h-12 w-full bg-passages-green text-base font-extrabold text-white hover:bg-passages-green-deep"
                disabled={isSubmitting || !cardReady}
                type="submit"
              >
                <CreditCard aria-hidden className="size-5" />
                {isSubmitting ? 'Processing...' : buttonLabel}
              </Button>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
  )
}
