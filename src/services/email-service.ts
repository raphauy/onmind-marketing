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
    console.warn('RESEND_API_KEY not set, skipping email send')
    return
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@onmindcrm.com'

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Tu código de acceso a OnMind Marketing',
    react: OtpEmail({ otp }),
  })
}
