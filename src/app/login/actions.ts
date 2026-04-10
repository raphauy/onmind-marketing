'use server'

import { signIn } from '@/lib/auth'
import { getUserByEmail } from '@/services/user-service'
import { generateOtp, createOtpToken } from '@/services/auth-service'
import { sendOtpEmail } from '@/services/email-service'
import { z } from 'zod'

const emailSchema = z.string().email('Email inválido')

type ActionResult = {
  success: boolean
  error?: string
  message?: string
  redirectUrl?: string
}

export async function checkEmailAction(email: string): Promise<ActionResult> {
  try {
    const validatedEmail = emailSchema.parse(email)

    const user = await getUserByEmail(validatedEmail)
    if (!user) {
      return { success: false, error: 'No existe una cuenta con este email' }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Email inválido' }
    }
    console.error('Error checking email:', error)
    return { success: false, error: 'Error al verificar el email' }
  }
}

export async function sendOtpAction(email: string): Promise<ActionResult> {
  try {
    const validatedEmail = emailSchema.parse(email)

    const user = await getUserByEmail(validatedEmail)
    if (!user) {
      return { success: false, error: 'No existe una cuenta con este email' }
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'Tu cuenta está desactivada. Contactá al administrador.',
      }
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await createOtpToken({
      userId: user.id,
      token: otp,
      expiresAt,
    })

    await sendOtpEmail({ to: validatedEmail, otp })

    return {
      success: true,
      message: 'Código enviado a tu email',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Email inválido' }
    }
    console.error('Error sending OTP:', error)
    return { success: false, error: 'Error al enviar el código' }
  }
}

export async function verifyOtpAction(
  email: string,
  otp: string
): Promise<ActionResult> {
  try {
    const validatedEmail = emailSchema.parse(email)

    if (!/^\d{6}$/.test(otp)) {
      return { success: false, error: 'El código debe ser de 6 dígitos' }
    }

    const user = await getUserByEmail(validatedEmail)
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    const result = await signIn('credentials', {
      email: validatedEmail,
      otp,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: 'Código inválido o expirado' }
    }

    return { success: true, redirectUrl: '/dashboard' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Email inválido' }
    }
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'Error al verificar el código' }
  }
}
