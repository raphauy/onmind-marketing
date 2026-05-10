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
  whenLabel = "Martes 13 de mayo, 10:00 hs",
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

              <Section className="px-6 pt-5 pb-5">
                <Heading
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: "0 0 10px 0",
                    lineHeight: "1.3",
                  }}
                >
                  Hola {leadName}
                </Heading>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "15px",
                    lineHeight: "1.5",
                    margin: "0 0 18px 0",
                  }}
                >
                  Tu demo con <strong>{ownerName}</strong> quedó agendada.
                </Text>

                <Section style={EMAIL_INLINE_STYLES.dataSection}>
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textSecondary,
                      fontSize: "12px",
                      margin: "0 0 6px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: "600",
                    }}
                  >
                    Cuándo
                  </Text>
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textPrimary,
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                      textTransform: "capitalize" as const,
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
                  En unos minutos te llega un segundo email con el link de
                  Google Meet. Cualquier consulta, respondé este mensaje.
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
