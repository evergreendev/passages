import type { CollectionAfterChangeHook, CollectionConfig, Validate } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const requiredYesNo = (name: string, label: string) => ({
  name,
  type: 'radio' as const,
  label,
  options: yesNoOptions,
  required: true,
})

const requireWhenYes = (field: string, message: string): Validate<string | null | undefined> => {
  return (value, { siblingData }) => {
    if (siblingData?.[field] === 'yes' && !value) {
      return message
    }

    return true
  }
}

type PreApplicationEmailDoc = {
  caseManager?: string | null
  childrenCount?: number | null
  currentlyIncarcerated?: string | null
  dateOfBirth?: string | null
  email?: string | null
  firstName?: string | null
  id?: number | string
  lastName?: string | null
  notificationEmails?: string | null
  phoneNumber?: string | null
  previouslyIncarcerated?: string | null
  releaseDate?: string | null
  veteran?: string | null
}

const formatValue = (value: number | string | null | undefined) => {
  if (value === undefined || value === null || value === '') return 'Not provided'

  return String(value)
}

const escapeHTML = (value: number | string | null | undefined) =>
  formatValue(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const parseRecipients = (value: string | null | undefined) =>
  Array.from(
    new Set(
      value
        ?.split(/[\n,]+/)
        .map((email) => email.trim())
        .filter(Boolean) || [],
    ),
  )

const buildRows = (doc: PreApplicationEmailDoc) => [
  ['Name', `${formatValue(doc.firstName)} ${formatValue(doc.lastName)}`],
  ['Email', doc.email],
  ['Phone', doc.phoneNumber],
  ['Date of birth', doc.dateOfBirth],
  ['Currently incarcerated', doc.currentlyIncarcerated],
  ['Previously incarcerated', doc.previouslyIncarcerated],
  ['Release date', doc.releaseDate],
  ['Case manager', doc.caseManager],
  ['Veteran', doc.veteran],
  ['Children count', doc.childrenCount],
]

const sendPreApplicationNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const preApplication = doc as PreApplicationEmailDoc
  const recipients = parseRecipients(preApplication.notificationEmails)

  if (recipients.length === 0) return doc

  const rows = buildRows(preApplication)
  const text = rows.map(([label, value]) => `${label}: ${formatValue(value)}`).join('\n')
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(label)}</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(value)}</td></tr>`,
    )
    .join('')

  try {
    await req.payload.sendEmail({
      html: `
        <p>A new pre-application has been submitted.</p>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
          ${htmlRows}
        </table>
      `,
      subject: `New pre-application: ${formatValue(preApplication.firstName)} ${formatValue(preApplication.lastName)}`,
      text: `A new pre-application has been submitted.\n\n${text}`,
      to: recipients.join(','),
    })
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: 'Failed to send pre-application notification email',
      preApplicationID: preApplication.id,
    })
  }

  return doc
}

export const PreApplications: CollectionConfig = {
  slug: 'preApplications',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email', 'createdAt'],
    group: 'Submissions',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'notificationEmails',
      type: 'textarea',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
      ],
    },
    { name: 'otherKnownNames', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'phoneNumber', type: 'text' },
        { name: 'dateOfBirth', type: 'date', required: true },
      ],
    },
    { name: 'email', type: 'email', required: true },
    requiredYesNo('currentlyIncarcerated', 'Currently Incarcerated'),
    { name: 'caseManager', type: 'text' },
    requiredYesNo('previouslyIncarcerated', 'Previously Incarcerated'),
    {
      name: 'previousIncarcerationExplanation',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.previouslyIncarcerated === 'yes',
      },
      validate: requireWhenYes(
        'previouslyIncarcerated',
        'Please explain the previous incarceration history.',
      ),
    },
    {
      type: 'row',
      fields: [
        { name: 'paroleReviewDate', type: 'date' },
        { name: 'releaseDate', type: 'date' },
      ],
    },
    requiredYesNo('veteran', 'Veteran'),
    { name: 'substancesUseMisuse', type: 'textarea' },
    { name: 'dateOfLastUse', type: 'date' },
    requiredYesNo('mentalEmotionalConcerns', 'Mental / Emotional Concerns'),
    {
      name: 'mentalEmotionalExplanation',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.mentalEmotionalConcerns === 'yes',
      },
      validate: requireWhenYes(
        'mentalEmotionalConcerns',
        'Please explain the mental or emotional concerns.',
      ),
    },
    requiredYesNo('pregnant', 'Pregnant'),
    {
      type: 'row',
      admin: {
        condition: (_, siblingData) => siblingData?.pregnant === 'yes',
      },
      fields: [
        { name: 'dueDate', type: 'date' },
        {
          name: 'prenatalCare',
          type: 'radio',
          label: 'Prenatal Care',
          options: yesNoOptions,
        },
      ],
    },
    { name: 'childrenCount', type: 'number', min: 0 },
    { name: 'childrenLivingWhere', type: 'textarea' },
    {
      name: 'suicideThoughts',
      type: 'radio',
      label: 'Suicide Thoughts',
      options: yesNoOptions,
    },
    {
      name: 'suicideThoughtsWhen',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.suicideThoughts === 'yes',
      },
      validate: requireWhenYes('suicideThoughts', 'Please describe when this occurred.'),
    },
    { name: 'currentMedications', type: 'textarea' },
    requiredYesNo('physicalConditionsRequireMedication', 'Physical Conditions Require Medication'),
    {
      name: 'physicalConditionsDescription',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.physicalConditionsRequireMedication === 'yes',
      },
      validate: requireWhenYes(
        'physicalConditionsRequireMedication',
        'Please describe the physical conditions that require medication.',
      ),
    },
    requiredYesNo('receiveSsiSsd', 'Receive SSI / SSD'),
    requiredYesNo('livedInTransitionalHousing', 'Lived in Transitional Housing'),
    {
      name: 'transitionalHousingExplanation',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.livedInTransitionalHousing === 'yes',
      },
      validate: requireWhenYes(
        'livedInTransitionalHousing',
        'Please explain the transitional housing history.',
      ),
    },
    {
      name: 'pastTreatmentTypes',
      type: 'select',
      hasMany: true,
      options: [
        'Individual Therapy',
        'Group Therapy',
        'Substance Abuse Treatment',
        'In-Home Case Management',
        'Intensive Outpatient',
        'Inpatient Care',
        'Residential Care',
        'Hospitalizations',
      ],
    },
  ],
  hooks: {
    afterChange: [sendPreApplicationNotification],
  },
  timestamps: true,
}
