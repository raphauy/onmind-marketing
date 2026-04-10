import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'
import { ONMIND_EMAIL_COLORS, EMAIL_INLINE_STYLES } from './email-theme'

interface OtpEmailProps {
  otp?: string
  appName?: string
}

export default function OtpEmail({
  otp = '123456',
  appName = 'OnMind Marketing',
}: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Tu código de acceso a {appName}: {otp}
      </Preview>
      <Tailwind>
        <Body style={EMAIL_INLINE_STYLES.pageContainer}>
          <Container className="mx-auto w-[580px] max-w-full px-4 py-4">
            <Section style={EMAIL_INLINE_STYLES.cardContainer}>
              <Section style={EMAIL_INLINE_STYLES.headerSection}>
                <Container className="px-4">
                  <Heading
                    className="text-lg font-bold"
                    style={{
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {appName}
                  </Heading>
                  <Text
                    className="mt-1 mb-0 text-sm opacity-90"
                    style={{
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      fontSize: '14px',
                      margin: '4px 0 0 0',
                      opacity: 0.9,
                    }}
                  >
                    Verificación de acceso
                  </Text>
                </Container>
              </Section>

              <Section className="px-4 pt-2 pb-3">
                <Heading
                  className="mt-0 mb-2 text-lg font-semibold"
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                  }}
                >
                  Tu código de verificación
                </Heading>

                <Text
                  className="mb-4 text-sm leading-5"
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    lineHeight: '1.5',
                    fontSize: '14px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Usá el siguiente código para completar tu inicio de sesión.
                  Expira en 10 minutos.
                </Text>

                <Section className="mb-4 text-center">
                  <div style={EMAIL_INLINE_STYLES.codeSection}>
                    <Text
                      className="m-0 text-2xl font-bold tracking-[0.5em]"
                      style={{
                        color: ONMIND_EMAIL_COLORS.textPrimary,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5em',
                        margin: 0,
                        fontFamily: 'monospace',
                      }}
                    >
                      {otp}
                    </Text>
                  </div>
                </Section>

                <Text
                  className="mb-3 text-xs leading-4"
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: '12px',
                    lineHeight: '1.4',
                    margin: '0 0 12px 0',
                  }}
                >
                  Por seguridad, no compartas este código con nadie. Si no
                  solicitaste este acceso, ignorá este email.
                </Text>

                <Section style={EMAIL_INLINE_STYLES.infoAlert}>
                  <Text
                    className="m-0 text-xs font-medium"
                    style={{
                      color: ONMIND_EMAIL_COLORS.info,
                      fontSize: '12px',
                      margin: 0,
                      fontWeight: '500',
                    }}
                  >
                    🔒 Nunca te vamos a pedir tu código por teléfono, email u
                    otro medio.
                  </Text>
                </Section>
              </Section>

              <Section style={EMAIL_INLINE_STYLES.footerSection}>
                <Text
                  className="m-0 text-center text-xs"
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: '12px',
                    textAlign: 'center',
                    margin: 0,
                  }}
                >
                  Email enviado como parte de la seguridad de tu cuenta de{' '}
                  {appName}.
                </Text>
                <Text
                  className="mt-1 mb-0 text-center text-xs"
                  style={{
                    color: ONMIND_EMAIL_COLORS.textMuted,
                    fontSize: '12px',
                    textAlign: 'center',
                    margin: '4px 0 0 0',
                  }}
                >
                  © {new Date().getFullYear()} {appName}. Todos los derechos
                  reservados.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
