import { Resend } from 'resend'
import { format } from 'date-fns-tz'
import { es } from 'date-fns/locale'
import OtpEmail from '@/components/emails/otp-email'
import LeadCreatedEmail from '@/components/emails/lead-created-email'
import LeadStatusChangedEmail from '@/components/emails/lead-status-changed-email'
import BookingConfirmedOwnerEmail from '@/components/emails/booking-confirmed-owner-email'
import BookingConfirmedLeadEmail from '@/components/emails/booking-confirmed-lead-email'
import LeadNeedsFollowUpEmail from '@/components/emails/lead-needs-followup-email'
import { UY_TZ } from '@/lib/dates'

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://marketing.onmindcrm.com'

// Emails INTERNOS (entre socios) que están temporalmente silenciados.
// No afecta los emails al lead (confirmación de booking, OTP, etc.).
// Sacar de este set para volver a recibir emails internos.
// TODO: revertir antes de cerrar la prueba en producción.
const MUTED_INTERNAL_RECIPIENTS = new Set<string>([
  'msedes@remax.com.uy',
])

function filterMuted(to: string[]): {
  filtered: string[]
  muted: string[]
} {
  const filtered: string[] = []
  const muted: string[] = []
  for (const addr of to) {
    if (MUTED_INTERNAL_RECIPIENTS.has(addr)) muted.push(addr)
    else filtered.push(addr)
  }
  return { filtered, muted }
}

interface SendOtpEmailInput {
  to: string
  otp: string
}

export async function sendOtpEmail(input: SendOtpEmailInput): Promise<void> {
  const { to, otp } = input

  if (process.env.NODE_ENV === 'development') {
    console.log('\n========================================')
    console.log(`  OTP Code for ${to}: ${otp}`)
    console.log('========================================\n')
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendOtpEmail] RESEND_API_KEY is not set')
    throw new Error('RESEND_API_KEY is not configured')
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'

  console.log(`[sendOtpEmail] sending to=${to} from=${fromEmail}`)

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Tu código de acceso a OnMind Marketing',
    react: OtpEmail({ otp }),
  })

  if (error) {
    console.error('[sendOtpEmail] Resend returned error:', error)
    throw new Error(`Resend error: ${error.name} - ${error.message}`)
  }

  console.log(`[sendOtpEmail] sent id=${data?.id}`)
}

interface SendLeadCreatedEmailInput {
  to: string[]
  leadId: string
  leadName: string
  leadEmail: string
  leadPhone?: string | null
  leadSourceLabel: string
  leadBusinessType?: string | null
  ownerName?: string | null
}

export async function sendLeadCreatedEmail(
  input: SendLeadCreatedEmailInput
): Promise<void> {
  if (input.to.length === 0) return
  const { filtered: to, muted } = filterMuted(input.to)
  if (muted.length > 0) {
    console.log(`[sendLeadCreatedEmail] muted: ${muted.join(', ')}`)
  }
  if (to.length === 0) return

  const detailUrl = `${APP_URL}/dashboard/leads/${input.leadId}`
  const subject = `Lead nuevo: ${input.leadName}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n[sendLeadCreatedEmail] (dev mode, not sending)')
    console.log(`  to: ${input.to.join(', ')}`)
    console.log(`  subject: ${subject}`)
    console.log(`  detailUrl: ${detailUrl}`)
    console.log(`  owner: ${input.ownerName ?? 'sin owner'}`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendLeadCreatedEmail] RESEND_API_KEY is not set')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react: LeadCreatedEmail({
      leadName: input.leadName,
      leadEmail: input.leadEmail,
      leadPhone: input.leadPhone,
      leadSourceLabel: input.leadSourceLabel,
      leadBusinessType: input.leadBusinessType,
      ownerName: input.ownerName,
      detailUrl,
    }),
  })

  if (error) {
    console.error('[sendLeadCreatedEmail] Resend returned error:', error)
    return
  }

  console.log(`[sendLeadCreatedEmail] sent id=${data?.id}`)
}

interface SendLeadStatusChangedEmailInput {
  to: string[]
  leadId: string
  leadName: string
  fromStatusLabel: string
  toStatusLabel: string
  changedByName?: string | null
}

function formatBookingWhen(d: Date): string {
  return format(d, "EEEE d 'de' MMMM, HH:mm 'hs'", {
    timeZone: UY_TZ,
    locale: es,
  })
}

interface SendBookingOwnerInput {
  to: string[]
  ownerName: string
  leadId: string
  leadName: string
  leadEmail: string
  startsAt: Date
}

export async function sendBookingConfirmedOwnerEmail(
  input: SendBookingOwnerInput
): Promise<void> {
  if (input.to.length === 0) return
  const { filtered: to, muted } = filterMuted(input.to)
  if (muted.length > 0) {
    console.log(`[sendBookingConfirmedOwnerEmail] muted: ${muted.join(', ')}`)
  }
  if (to.length === 0) return

  const detailUrl = `${APP_URL}/dashboard/leads/${input.leadId}`
  const whenLabel = formatBookingWhen(input.startsAt)
  const subject = `${input.leadName} reservó la demo: ${whenLabel}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n[sendBookingConfirmedOwnerEmail] (dev mode, not sending)')
    console.log(`  to: ${input.to.join(', ')}`)
    console.log(`  subject: ${subject}`)
    console.log(`  detailUrl: ${detailUrl}`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendBookingConfirmedOwnerEmail] RESEND_API_KEY is not set')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react: BookingConfirmedOwnerEmail({
      ownerName: input.ownerName,
      leadName: input.leadName,
      leadEmail: input.leadEmail,
      whenLabel,
      detailUrl,
    }),
  })

  if (error) {
    console.error('[sendBookingConfirmedOwnerEmail] Resend error:', error)
    return
  }
  console.log(`[sendBookingConfirmedOwnerEmail] sent id=${data?.id}`)
}

interface SendBookingLeadInput {
  to: string[]
  leadName: string
  ownerName: string
  startsAt: Date
}

export async function sendBookingConfirmedLeadEmail(
  input: SendBookingLeadInput
): Promise<void> {
  if (input.to.length === 0) return

  const whenLabel = formatBookingWhen(input.startsAt)
  const subject = `Demo confirmada: ${whenLabel}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n[sendBookingConfirmedLeadEmail] (dev mode, not sending)')
    console.log(`  to: ${input.to.join(', ')}`)
    console.log(`  subject: ${subject}`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendBookingConfirmedLeadEmail] RESEND_API_KEY is not set')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: input.to,
    subject,
    react: BookingConfirmedLeadEmail({
      leadName: input.leadName,
      ownerName: input.ownerName,
      whenLabel,
    }),
  })

  if (error) {
    console.error('[sendBookingConfirmedLeadEmail] Resend error:', error)
    return
  }
  console.log(`[sendBookingConfirmedLeadEmail] sent id=${data?.id}`)
}

export async function sendLeadStatusChangedEmail(
  input: SendLeadStatusChangedEmailInput
): Promise<void> {
  if (input.to.length === 0) return
  const { filtered: to, muted } = filterMuted(input.to)
  if (muted.length > 0) {
    console.log(`[sendLeadStatusChangedEmail] muted: ${muted.join(', ')}`)
  }
  if (to.length === 0) return

  const detailUrl = `${APP_URL}/dashboard/leads/${input.leadId}`
  const subject = `${input.leadName}: ${input.fromStatusLabel} → ${input.toStatusLabel}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n[sendLeadStatusChangedEmail] (dev mode, not sending)')
    console.log(`  to: ${input.to.join(', ')}`)
    console.log(`  subject: ${subject}`)
    console.log(`  detailUrl: ${detailUrl}`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendLeadStatusChangedEmail] RESEND_API_KEY is not set')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react: LeadStatusChangedEmail({
      leadName: input.leadName,
      fromStatusLabel: input.fromStatusLabel,
      toStatusLabel: input.toStatusLabel,
      changedByName: input.changedByName,
      detailUrl,
    }),
  })

  if (error) {
    console.error('[sendLeadStatusChangedEmail] Resend returned error:', error)
    return
  }

  console.log(`[sendLeadStatusChangedEmail] sent id=${data?.id}`)
}

interface SendLeadNeedsFollowUpInput {
  to: string[]
  leadId: string
  leadName: string
  statusLabel: string
  daysSinceUpdate: number
  ownerName: string
}

export async function sendLeadNeedsFollowUpEmail(
  input: SendLeadNeedsFollowUpInput
): Promise<void> {
  if (input.to.length === 0) return
  const { filtered: to, muted } = filterMuted(input.to)
  if (muted.length > 0) {
    console.log(`[sendLeadNeedsFollowUpEmail] muted: ${muted.join(', ')}`)
  }
  if (to.length === 0) return

  const detailUrl = `${APP_URL}/dashboard/leads/${input.leadId}`
  const subject = `Lead ${input.leadName} necesita seguimiento`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n[sendLeadNeedsFollowUpEmail] (dev mode, not sending)')
    console.log(`  to: ${input.to.join(', ')}`)
    console.log(`  subject: ${subject}`)
    console.log(`  detailUrl: ${detailUrl}`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[sendLeadNeedsFollowUpEmail] RESEND_API_KEY is not set')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react: LeadNeedsFollowUpEmail({
      ownerName: input.ownerName,
      leadName: input.leadName,
      statusLabel: input.statusLabel,
      daysSinceUpdate: input.daysSinceUpdate,
      detailUrl,
    }),
  })

  if (error) {
    console.error('[sendLeadNeedsFollowUpEmail] Resend error:', error)
    return
  }
  console.log(`[sendLeadNeedsFollowUpEmail] sent id=${data?.id}`)
}
