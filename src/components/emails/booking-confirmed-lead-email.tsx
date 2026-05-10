import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { ONMIND_EMAIL_COLORS, EMAIL_INLINE_STYLES } from "./email-theme"

interface Props {
  leadName: string
  ownerName: string
  whenLabel: string
  appName?: string
}

export default function BookingConfirmedLeadEmail({
  leadName = "Nombre",
  ownerName = "Raphael",
  whenLabel = "Martes 13 de mayo, 10:00 hs (UY)",
  appName = "OnMind",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Demo confirmada: {whenLabel}</Preview>
      <Tailwind>
        <Body style={EMAIL_INLINE_STYLES.pageContainer}>
          <Container className="mx-auto w-[580px] max-w-full px-4 py-4">
            <Section style={EMAIL_INLINE_STYLES.cardContainer}>
              <Section style={EMAIL_INLINE_STYLES.headerSection}>
                <Container className="px-4">
                  <Heading
                    style={{
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {appName}
                  </Heading>
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      fontSize: "14px",
                      margin: "4px 0 0 0",
                      opacity: 0.9,
                    }}
                  >
                    Demo confirmada
                  </Text>
                </Container>
              </Section>

              <Section className="px-4 pt-2 pb-3">
                <Heading
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: "0 0 6px 0",
                  }}
                >
                  Hola {leadName}
                </Heading>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: "14px",
                    margin: "0 0 12px 0",
                    lineHeight: "1.5",
                  }}
                >
                  Tu demo con {ownerName} quedó agendada.
                </Text>

                <Section
                  style={{
                    backgroundColor: ONMIND_EMAIL_COLORS.mutedSection,
                    borderRadius: "6px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                  }}
                >
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textPrimary,
                      fontSize: "15px",
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    {whenLabel}
                  </Text>
                </Section>

                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: "13px",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  En unos minutos te llega el link de Google Meet por email.
                  Cualquier cosa, respondé este mensaje.
                </Text>
              </Section>

              <Section style={EMAIL_INLINE_STYLES.footerSection}>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textMuted,
                    fontSize: "12px",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  © {new Date().getFullYear()} {appName}.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
