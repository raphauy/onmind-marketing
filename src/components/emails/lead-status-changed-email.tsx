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

interface LeadStatusChangedEmailProps {
  leadName: string
  fromStatusLabel: string
  toStatusLabel: string
  changedByName?: string | null
  detailUrl: string
  appName?: string
}

export default function LeadStatusChangedEmail({
  leadName = "Nombre del lead",
  fromStatusLabel = "Nuevo",
  toStatusLabel = "Contactado",
  changedByName,
  detailUrl = "https://marketing.onmindcrm.com/dashboard/leads",
  appName = "OnMind Marketing",
}: LeadStatusChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {leadName}: {fromStatusLabel} → {toStatusLabel}
      </Preview>
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
                    Cambio de estado en un lead
                  </Text>
                </Container>
              </Section>

              <Section className="px-4 pt-2 pb-3">
                <Heading
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: "0 0 12px 0",
                  }}
                >
                  {leadName}
                </Heading>

                <Section
                  style={{
                    backgroundColor: ONMIND_EMAIL_COLORS.mutedSection,
                    borderRadius: "6px",
                    padding: "16px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textSecondary,
                      fontSize: "12px",
                      margin: "0 0 8px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Estado
                  </Text>
                  <Text
                    style={{
                      color: ONMIND_EMAIL_COLORS.textPrimary,
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    {fromStatusLabel} → {toStatusLabel}
                  </Text>
                  {changedByName && (
                    <Text
                      style={{
                        color: ONMIND_EMAIL_COLORS.textSecondary,
                        fontSize: "12px",
                        margin: "8px 0 0 0",
                      }}
                    >
                      Movido por {changedByName}
                    </Text>
                  )}
                </Section>

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
                    Ver lead
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
