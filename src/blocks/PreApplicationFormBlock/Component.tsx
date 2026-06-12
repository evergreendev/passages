'use client'

import type { PreApplicationFormBlock as PreApplicationFormBlockProps } from '@/payload-types'

import React, { useId, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

type YesNo = '' | 'yes' | 'no'

type FormState = {
  firstName: string
  lastName: string
  otherKnownNames: string
  phoneNumber: string
  dateOfBirth: string
  email: string
  currentlyIncarcerated: YesNo
  caseManager: string
  previouslyIncarcerated: YesNo
  previousIncarcerationExplanation: string
  paroleReviewDate: string
  releaseDate: string
  veteran: YesNo
  substancesUseMisuse: string
  dateOfLastUse: string
  mentalEmotionalConcerns: YesNo
  mentalEmotionalExplanation: string
  pregnant: YesNo
  dueDate: string
  prenatalCare: YesNo
  childrenCount: string
  childrenLivingWhere: string
  suicideThoughts: YesNo
  suicideThoughtsWhen: string
  currentMedications: string
  physicalConditionsRequireMedication: YesNo
  physicalConditionsDescription: string
  receiveSsiSsd: YesNo
  livedInTransitionalHousing: YesNo
  transitionalHousingExplanation: string
  pastTreatmentTypes: string[]
}

type FieldErrorMap = Partial<Record<keyof FormState | 'form', string>>

type TextField = {
  autoComplete?: string
  label: string
  name: keyof FormState
  required?: boolean
  type?: 'date' | 'email' | 'number' | 'tel' | 'text'
}

type TextareaField = {
  label: string
  name: keyof FormState
  required?: boolean
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  otherKnownNames: '',
  phoneNumber: '',
  dateOfBirth: '',
  email: '',
  currentlyIncarcerated: '',
  caseManager: '',
  previouslyIncarcerated: '',
  previousIncarcerationExplanation: '',
  paroleReviewDate: '',
  releaseDate: '',
  veteran: '',
  substancesUseMisuse: '',
  dateOfLastUse: '',
  mentalEmotionalConcerns: '',
  mentalEmotionalExplanation: '',
  pregnant: '',
  dueDate: '',
  prenatalCare: '',
  childrenCount: '',
  childrenLivingWhere: '',
  suicideThoughts: '',
  suicideThoughtsWhen: '',
  currentMedications: '',
  physicalConditionsRequireMedication: '',
  physicalConditionsDescription: '',
  receiveSsiSsd: '',
  livedInTransitionalHousing: '',
  transitionalHousingExplanation: '',
  pastTreatmentTypes: [],
}

const treatmentOptions = [
  'Individual Therapy',
  'Group Therapy',
  'Substance Abuse Treatment',
  'In-Home Case Management',
  'Intensive Outpatient',
  'Inpatient Care',
  'Residential Care',
  'Hospitalizations',
]

const textFields: TextField[] = [
  { name: 'firstName', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', required: true, autoComplete: 'family-name' },
  { name: 'otherKnownNames', label: 'Other known names' },
  { name: 'phoneNumber', label: 'Phone number', type: 'tel', autoComplete: 'tel' },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'caseManager', label: 'Case manager' },
  { name: 'paroleReviewDate', label: 'Parole review date', type: 'date' },
  { name: 'releaseDate', label: 'Release date', type: 'date' },
  { name: 'dateOfLastUse', label: 'Date of last use', type: 'date' },
  { name: 'childrenCount', label: 'Number of children', type: 'number' },
]

const yesNoFields: Array<{ label: string; name: keyof FormState; required?: boolean }> = [
  { name: 'currentlyIncarcerated', label: 'Are you currently incarcerated?', required: true },
  {
    name: 'previouslyIncarcerated',
    label: 'Have you previously been incarcerated?',
    required: true,
  },
  { name: 'veteran', label: 'Are you a veteran?', required: true },
  {
    name: 'mentalEmotionalConcerns',
    label: 'Do you have mental or emotional concerns?',
    required: true,
  },
  { name: 'pregnant', label: 'Are you pregnant?', required: true },
  { name: 'suicideThoughts', label: 'Have you had thoughts of suicide?' },
  {
    name: 'physicalConditionsRequireMedication',
    label: 'Do you have physical conditions that require medication?',
    required: true,
  },
  { name: 'receiveSsiSsd', label: 'Do you receive SSI / SSD?', required: true },
  {
    name: 'livedInTransitionalHousing',
    label: 'Have you lived in transitional housing?',
    required: true,
  },
]

const textareaFields: TextareaField[] = [
  { name: 'substancesUseMisuse', label: 'Substance use or misuse' },
  { name: 'childrenLivingWhere', label: 'Where are your children living?' },
  { name: 'currentMedications', label: 'Current medications' },
]

const getErrorMessage = (errors: FieldErrorMap, name: keyof FormState) => errors[name]

const cleanValue = (value: string) => (value === '' ? undefined : value)

const buildPayload = (state: FormState, notificationEmails?: string | null) => ({
  firstName: state.firstName,
  lastName: state.lastName,
  otherKnownNames: cleanValue(state.otherKnownNames),
  phoneNumber: cleanValue(state.phoneNumber),
  dateOfBirth: state.dateOfBirth,
  email: state.email,
  currentlyIncarcerated: state.currentlyIncarcerated,
  caseManager: cleanValue(state.caseManager),
  previouslyIncarcerated: state.previouslyIncarcerated,
  paroleReviewDate: cleanValue(state.paroleReviewDate),
  releaseDate: cleanValue(state.releaseDate),
  veteran: state.veteran,
  substancesUseMisuse: cleanValue(state.substancesUseMisuse),
  dateOfLastUse: cleanValue(state.dateOfLastUse),
  mentalEmotionalConcerns: state.mentalEmotionalConcerns,
  pregnant: state.pregnant,
  childrenCount: state.childrenCount === '' ? undefined : Number(state.childrenCount),
  childrenLivingWhere: cleanValue(state.childrenLivingWhere),
  suicideThoughts: cleanValue(state.suicideThoughts),
  currentMedications: cleanValue(state.currentMedications),
  physicalConditionsRequireMedication: state.physicalConditionsRequireMedication,
  receiveSsiSsd: state.receiveSsiSsd,
  livedInTransitionalHousing: state.livedInTransitionalHousing,
  notificationEmails: cleanValue(notificationEmails || ''),
  pastTreatmentTypes: state.pastTreatmentTypes,
  prenatalCare: state.pregnant === 'yes' ? cleanValue(state.prenatalCare) : undefined,
  dueDate: state.pregnant === 'yes' ? cleanValue(state.dueDate) : undefined,
  previousIncarcerationExplanation:
    state.previouslyIncarcerated === 'yes'
      ? cleanValue(state.previousIncarcerationExplanation)
      : undefined,
  mentalEmotionalExplanation:
    state.mentalEmotionalConcerns === 'yes'
      ? cleanValue(state.mentalEmotionalExplanation)
      : undefined,
  suicideThoughtsWhen:
    state.suicideThoughts === 'yes' ? cleanValue(state.suicideThoughtsWhen) : undefined,
  physicalConditionsDescription:
    state.physicalConditionsRequireMedication === 'yes'
      ? cleanValue(state.physicalConditionsDescription)
      : undefined,
  transitionalHousingExplanation:
    state.livedInTransitionalHousing === 'yes'
      ? cleanValue(state.transitionalHousingExplanation)
      : undefined,
})

const requiredIndicator = (required?: boolean) =>
  required ? <span className="ml-1 text-destructive">*</span> : null

export const PreApplicationFormBlock: React.FC<PreApplicationFormBlockProps> = ({
  heading,
  introText,
  notificationEmails,
  successMessage,
  submitButtonText,
}) => {
  const formId = useId()
  const [formState, setFormState] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FieldErrorMap>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const conditionalTextareas = useMemo<TextareaField[]>(() => {
    const fields: TextareaField[] = []

    if (formState.previouslyIncarcerated === 'yes') {
      fields.push({
        name: 'previousIncarcerationExplanation',
        label: 'Please explain your previous incarceration history',
        required: true,
      })
    }

    if (formState.mentalEmotionalConcerns === 'yes') {
      fields.push({
        name: 'mentalEmotionalExplanation',
        label: 'Please explain your mental or emotional concerns',
        required: true,
      })
    }

    if (formState.suicideThoughts === 'yes') {
      fields.push({
        name: 'suicideThoughtsWhen',
        label: 'When did you have thoughts of suicide?',
        required: true,
      })
    }

    if (formState.physicalConditionsRequireMedication === 'yes') {
      fields.push({
        name: 'physicalConditionsDescription',
        label: 'Please describe the physical conditions that require medication',
        required: true,
      })
    }

    if (formState.livedInTransitionalHousing === 'yes') {
      fields.push({
        name: 'transitionalHousingExplanation',
        label: 'Please explain your transitional housing history',
        required: true,
      })
    }

    return fields
  }, [
    formState.livedInTransitionalHousing,
    formState.mentalEmotionalConcerns,
    formState.physicalConditionsRequireMedication,
    formState.previouslyIncarcerated,
    formState.suicideThoughts,
  ])

  const setValue = (name: keyof FormState, value: string | string[]) => {
    setFormState((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
  }

  const renderTextInput = ({ autoComplete, label, name, required, type = 'text' }: TextField) => {
    const fieldId = `${formId}-${name}`
    const error = getErrorMessage(errors, name)

    return (
      <div className="space-y-2" key={name}>
        <label className="text-sm font-semibold text-foreground" htmlFor={fieldId}>
          {label}
          {requiredIndicator(required)}
        </label>
        <Input
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          id={fieldId}
          min={type === 'number' ? 0 : undefined}
          name={name}
          onChange={(event) => setValue(name, event.target.value)}
          required={required}
          type={type}
          value={formState[name] as string}
        />
        {error && (
          <p className="text-sm text-destructive" id={`${fieldId}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }

  const renderTextarea = ({ label, name, required }: TextareaField) => {
    const fieldId = `${formId}-${name}`
    const error = getErrorMessage(errors, name)

    return (
      <div className="space-y-2" key={name}>
        <label className="text-sm font-semibold text-foreground" htmlFor={fieldId}>
          {label}
          {requiredIndicator(required)}
        </label>
        <Textarea
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={Boolean(error)}
          id={fieldId}
          name={name}
          onChange={(event) => setValue(name, event.target.value)}
          required={required}
          rows={4}
          value={formState[name] as string}
        />
        {error && (
          <p className="text-sm text-destructive" id={`${fieldId}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }

  const renderYesNo = ({ label, name, required }: (typeof yesNoFields)[number]) => {
    const groupId = `${formId}-${name}`
    const error = getErrorMessage(errors, name)

    return (
      <fieldset
        aria-describedby={error ? `${groupId}-error` : undefined}
        className="space-y-3 rounded-lg border border-border p-4"
        key={name}
      >
        <legend className="text-sm font-semibold text-foreground">
          {label}
          {requiredIndicator(required)}
        </legend>
        <div className="flex gap-6">
          {(['yes', 'no'] as const).map((option) => (
            <label className="flex items-center gap-2 text-sm" key={option}>
              <input
                checked={formState[name] === option}
                className="size-4 accent-primary"
                name={name}
                onChange={() => setValue(name, option)}
                required={required}
                type="radio"
                value={option}
              />
              {option === 'yes' ? 'Yes' : 'No'}
            </label>
          ))}
        </div>
        {error && (
          <p className="text-sm text-destructive" id={`${groupId}-error`}>
            {error}
          </p>
        )}
      </fieldset>
    )
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch(`${getClientSideURL()}/api/preApplications`, {
        body: JSON.stringify(buildPayload(formState, notificationEmails)),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const nextErrors: FieldErrorMap = {}
        const validationErrors = data?.errors?.[0]?.data?.errors || data?.errors

        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((validationError) => {
            const field = validationError.path || validationError.field || validationError.name

            if (field && field in initialState) {
              nextErrors[field as keyof FormState] = validationError.message
            }
          })
        }

        setErrors({
          form: data?.errors?.[0]?.message || 'Please review the form and try again.',
          ...nextErrors,
        })
        return
      }

      setHasSubmitted(true)
      setFormState(initialState)
    } catch (error) {
      console.warn(error)
      setErrors({ form: 'The form could not be submitted. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasSubmitted) {
    return (
      <section className="container py-12 lg:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-10">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">{heading}</h2>
          <p className="text-lg text-muted-foreground">{successMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-12 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{heading}</h2>
          {introText && <p className="mt-4 text-lg text-muted-foreground">{introText}</p>}
          <p className="mt-3 text-sm text-muted-foreground">
            Fields marked with <span className="text-destructive">*</span> are required.
          </p>
        </div>

        <form
          className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-8"
          onSubmit={onSubmit}
        >
          {errors.form && (
            <div
              className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
              role="alert"
            >
              {errors.form}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">{textFields.map(renderTextInput)}</div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">{yesNoFields.map(renderYesNo)}</div>

          {formState.pregnant === 'yes' && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {renderTextInput({ name: 'dueDate', label: 'Due date', type: 'date' })}
              {renderYesNo({ name: 'prenatalCare', label: 'Are you receiving prenatal care?' })}
            </div>
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[...textareaFields, ...conditionalTextareas].map(renderTextarea)}
          </div>

          <fieldset className="mt-6 space-y-3 rounded-lg border border-border p-4">
            <legend className="text-sm font-semibold text-foreground">Past treatment types</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {treatmentOptions.map((option) => (
                <label className="flex items-start gap-3 text-sm" key={option}>
                  <input
                    checked={formState.pastTreatmentTypes.includes(option)}
                    className="mt-0.5 size-4 accent-primary"
                    name="pastTreatmentTypes"
                    onChange={(event) => {
                      const nextValue = event.target.checked
                        ? [...formState.pastTreatmentTypes, option]
                        : formState.pastTreatmentTypes.filter((value) => value !== option)

                      setValue('pastTreatmentTypes', nextValue)
                    }}
                    type="checkbox"
                    value={option}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <Button
            className={cn('mt-8 min-w-40', isSubmitting && 'opacity-80')}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </Button>
        </form>
      </div>
    </section>
  )
}
