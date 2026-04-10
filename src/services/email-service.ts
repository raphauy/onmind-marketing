import { Resend } from 'resend'
import OtpEmail from '@/components/emails/otp-email'

const resend = new Resend(process.env.RESEND_API_KEY)

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
