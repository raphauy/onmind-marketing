import {
  Body,
  Button,
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
  ownerName: string
  leadName: string
  leadEmail: string
  whenLabel: string // ej. "Martes 13 de mayo, 10:00 hs (UY)"
  detailUrl: string
  appName?: string
}

export default function BookingConfirmedOwnerEmail({
  ownerName = "Raphael",
  leadName = "Lead",
  leadEmail = "lead@ejemplo.com",
  whenLabel = "Martes 13 de mayo, 10:00 hs (UY)",
  detailUrl = "https://marketing.onmindcrm.com/dashboard/leads",
  appName = "OnMind Marketing",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{leadName} reservó la demo: {whenLabel}</Preview>
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
                    Demo agendada
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
                  Hola {ownerName}
                </Heading>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: "14px",
                    margin: "0 0 12px 0",
                    lineHeight: "1.5",
                  }}
                >
                  {leadName} reservó un slot para la demo de OnMind.
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
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textSecondary,
                      fontSize: "13px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    Lead: {leadName} ({leadEmail})
                  </Text>
                </Section>

                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: "13px",
                    margin: "0 0 16px 0",
                    lineHeight: "1.5",
                  }}
                >
                  Desde el detail del lead podés crear el evento en Google
                  Calendar y mandarle el link de Meet.
                </Text>

                <Section className="text-center">
                  <Button
                    href={detailUrl}
                    style={{
                      backgroundColor: ONMIND_EMAIL_COLORS.primary,
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      padding: "10px 20px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Abrir lead
                  </Button>
                </Section>
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
