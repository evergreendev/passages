'use client'

import { Button, toast, useConfig, useSelection } from '@payloadcms/ui'
import React, { useState } from 'react'

export const SendSelectedPreApplications: React.FC = () => {
  const { config } = useConfig()
  const { count, selectedIDs } = useSelection()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (count === 0) return null

  const sendEmails = async () => {
    setIsSending(true)

    try {
      const response = await fetch(
        `${config.routes.api}/preApplications/send-notifications`,
        {
          body: JSON.stringify({ email, ids: selectedIDs }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        },
      )
      const result = (await response.json().catch(() => null)) as
        | { errors?: Array<{ message?: string }>; sent?: number }
        | null

      if (!response.ok) {
        throw new Error(result?.errors?.[0]?.message || 'The emails could not be sent.')
      }

      toast.success(`Sent ${result?.sent ?? count} pre-application email${count === 1 ? '' : 's'}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The emails could not be sent.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      style={{
        alignItems: 'end',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      <label style={{ display: 'grid', gap: '6px', minWidth: '280px' }}>
        <span>Send selected applications to</span>
        <input
          onChange={(event) => setEmail(event.target.value)}
          placeholder="recipient@example.com"
          type="email"
          value={email}
        />
      </label>
      <Button disabled={isSending || !email.trim()} onClick={sendEmails} type="button">
        {isSending ? 'Sending…' : `Send ${count} selected`}
      </Button>
    </div>
  )
}
