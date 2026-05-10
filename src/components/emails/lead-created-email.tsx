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

interface LeadCreatedEmailProps {
  leadName: string
  leadEmail: string
  leadPhone?: string | null
  leadSourceLabel?: string
  leadBusinessType?: string | null
  ownerName?: string | null
  detailUrl: string
  appName?: string
}

export default function LeadCreatedEmail({
  leadName = "Nombre del lead",
  leadEmail = "lead@ejemplo.com",
  leadPhone,
  leadSourceLabel = "Web",
  leadBusinessType,
  ownerName,
  detailUrl = "https://marketing.onmindcrm.com/dashboard/leads",
  appName = "OnMind Marketing",
}: LeadCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Lead nuevo: {leadName}
        {ownerName ? ` — asignado a ${ownerName}` : ""}
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
                    Llegó un lead nuevo
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

                {ownerName && (
                  <Section
                    style={{
                      ...EMAIL_INLINE_STYLES.infoAlert,
                      marginBottom: "16px",
                    }}
                  >
                    <Text
                      style={{
                        color: ONMIND_EMAIL_COLORS.info,
                        fontSize: "13px",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Asignado a {ownerName}
                    </Text>
                  </Section>
                )}

                <Section
                  style={{
                    backgroundColor: ONMIND_EMAIL_COLORS.mutedSection,
                    borderRadius: "6px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                  }}
                >
                  <DataRow label="Email" value={leadEmail} />
                  {leadPhone && <DataRow label="WhatsApp" value={leadPhone} />}
                  <DataRow label="Origen" value={leadSourceLabel} />
                  {leadBusinessType && (
                    <DataRow label="Rubro" value={leadBusinessType} />
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

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <Text
      style={{
        margin: "0 0 6px 0",
        fontSize: "14px",
        color: ONMIND_EMAIL_COLORS.textPrimary,
        lineHeight: "1.5",
      }}
    >
      <span
        style={{
          color: ONMIND_EMAIL_COLORS.textSecondary,
          fontSize: "12px",
          marginRight: "8px",
        }}
      >
        {label}:
      </span>
      {value}
    </Text>
  )
}
