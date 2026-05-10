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
  whenLabel: string
  detailUrl: string
  appName?: string
}

export default function BookingConfirmedOwnerEmail({
  ownerName = "Raphael",
  leadName = "Lead",
  leadEmail = "lead@ejemplo.com",
  whenLabel = "Martes 13 de mayo, 10:00 hs",
  detailUrl = "https://marketing.onmindcrm.com/dashboard/leads",
  appName = "OnMind Marketing",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {leadName} reservó la demo: {whenLabel}
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
                    Demo agendada
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
                  Hola {ownerName}
                </Heading>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "15px",
                    lineHeight: "1.5",
                    margin: "0 0 18px 0",
                  }}
                >
                  <strong>{leadName}</strong>{" "}
                  <span style={{ color: ONMIND_EMAIL_COLORS.textSecondary }}>
                    reservó un slot para la demo de OnMind.
                  </span>
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
                  <Text style={EMAIL_INLINE_STYLES.dataDivider}>
                    <span
                      style={{
                        color: ONMIND_EMAIL_COLORS.textSecondary,
                        fontSize: "13px",
                        marginRight: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Lead:
                    </span>
                    <span
                      style={{
                        color: ONMIND_EMAIL_COLORS.textPrimary,
                        fontSize: "14px",
                      }}
                    >
                      {leadName} ({leadEmail})
                    </span>
                  </Text>
                </Section>

                <Section className="text-center">
                  <Button
                    href={detailUrl}
                    style={{
                      backgroundColor: ONMIND_EMAIL_COLORS.primary,
                      color: ONMIND_EMAIL_COLORS.textWhite,
                      padding: "10px 22px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Abrir lead
                  </Button>
                </Section>

                <Text style={EMAIL_INLINE_STYLES.explanatoryNote}>
                  Desde el detail del lead podés crear el evento en Google
                  Calendar y mandarle el link de Meet.
                </Text>
              </Section>

              <Section style={EMAIL_INLINE_STYLES.footerSection}>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {appName} · Sistema de notificaciones automáticas
                </Text>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textMuted,
                    fontSize: "12px",
                    textAlign: "center",
                    margin: "4px 0 0 0",
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
