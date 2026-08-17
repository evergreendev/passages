import type { CollectionAfterChangeHook, CollectionConfig, Payload, Validate } from 'payload'
import { APIError } from 'payload'

import type { PreApplication } from '../../payload-types'

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

type PreApplicationEmailDoc = Partial<PreApplication> & { id?: number | string }

const formatValue = (value: number | string | null | undefined) => {
  if (value === undefined || value === null || value === '') return 'Not provided'

  return String(value)
}

const formatDateOnly = (value: string | null | undefined) => {
  if (!value) return value

  return value.split('T')[0]
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
  ['Other known names', doc.otherKnownNames],
  ['Email', doc.email],
  ['Phone', doc.phoneNumber],
  ['Date of birth', formatDateOnly(doc.dateOfBirth)],
  ['Currently incarcerated', doc.currentlyIncarcerated],
  ['Case manager', doc.caseManager],
  ['Previously incarcerated', doc.previouslyIncarcerated],
  ['Previous incarceration explanation', doc.previousIncarcerationExplanation],
  ['Parole review date', formatDateOnly(doc.paroleReviewDate)],
  ['Release date', formatDateOnly(doc.releaseDate)],
  ['Veteran', doc.veteran],
  ['Substance use or misuse', doc.substancesUseMisuse],
  ['Date of last use', formatDateOnly(doc.dateOfLastUse)],
  ['Mental / emotional concerns', doc.mentalEmotionalConcerns],
  ['Mental / emotional explanation', doc.mentalEmotionalExplanation],
  ['Pregnant', doc.pregnant],
  ['Due date', formatDateOnly(doc.dueDate)],
  ['Prenatal care', doc.prenatalCare],
  ['Children count', doc.childrenCount],
  ['Where children are living', doc.childrenLivingWhere],
  ['Suicide thoughts', doc.suicideThoughts],
  ['When suicide thoughts occurred', doc.suicideThoughtsWhen],
  ['Current medications', doc.currentMedications],
  ['Physical conditions require medication', doc.physicalConditionsRequireMedication],
  ['Physical conditions description', doc.physicalConditionsDescription],
  ['Receive SSI / SSD', doc.receiveSsiSsd],
  ['Lived in transitional housing', doc.livedInTransitionalHousing],
  ['Transitional housing explanation', doc.transitionalHousingExplanation],
  ['Past treatment types', doc.pastTreatmentTypes?.join(', ')],
]

const sendPreApplicationEmail = async ({
  doc,
  payload,
  recipients,
}: {
  doc: PreApplicationEmailDoc
  payload: Payload
  recipients: string[]
}) => {
  const rows = buildRows(doc)
  const text = rows.map(([label, value]) => `${label}: ${formatValue(value)}`).join('\n')
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(label)}</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHTML(value)}</td></tr>`,
    )
    .join('')

  await payload.sendEmail({
    html: `
      <p>A new pre-application has been submitted.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${htmlRows}
      </table>
    `,
    subject: `New pre-application: ${formatValue(doc.firstName)} ${formatValue(doc.lastName)}`,
    text: `A new pre-application has been submitted.\n\n${text}`,
    to: recipients.join(','),
  })
}

const sendPreApplicationNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const preApplication = doc as PreApplicationEmailDoc
  const recipients = parseRecipients(preApplication.notificationEmails)

  if (recipients.length === 0) return doc

  try {
    await sendPreApplicationEmail({ doc: preApplication, payload: req.payload, recipients })
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
    components: {
      beforeListTable: [
        '@/collections/PreApplications/SendSelectedPreApplications#SendSelectedPreApplications',
      ],
    },
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
  endpoints: [
    {
      path: '/send-notifications',
      method: 'post',
      handler: async (req) => {
        if (!req.user) throw new APIError('Unauthorized', 401)

        if (!req.json) throw new APIError('A JSON request body is required.', 400)

        const body = (await req.json()) as { email?: unknown; ids?: unknown }
        const email = typeof body.email === 'string' ? body.email.trim() : ''
        const ids = Array.isArray(body.ids)
          ? body.ids.filter((id): id is number | string => ['number', 'string'].includes(typeof id))
          : []

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new APIError('Enter a valid recipient email address.', 400)
        }
        if (ids.length === 0) throw new APIError('Select at least one pre-application.', 400)

        for (const id of ids) {
          const preApplication = await req.payload.findByID({
            collection: 'preApplications',
            id,
            overrideAccess: false,
            req,
          })
          await sendPreApplicationEmail({
            doc: preApplication,
            payload: req.payload,
            recipients: [email],
          })
        }

        return Response.json({ sent: ids.length })
      },
    },
  ],
  hooks: {
    afterChange: [sendPreApplicationNotification],
  },
  timestamps: true,
}
