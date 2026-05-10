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
  statusLabel: string
  daysSinceUpdate: number
  detailUrl: string
  appName?: string
}

export default function LeadNeedsFollowUpEmail({
  ownerName = "Raphael",
  leadName = "Lead",
  statusLabel = "Contactado",
  daysSinceUpdate = 4,
  detailUrl = "https://marketing.onmindcrm.com/dashboard/leads",
  appName = "OnMind Marketing",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {`${leadName} lleva ${daysSinceUpdate} días sin movimiento en ${statusLabel}`}
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
                    Un lead necesita seguimiento
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
                    margin: "0 0 14px 0",
                    lineHeight: "1.5",
                  }}
                >
                  El lead <strong>{leadName}</strong> lleva{" "}
                  <strong>{daysSinceUpdate} días</strong> sin movimiento en
                  estado{" "}
                  <strong>{statusLabel}</strong>. Conviene volver a contactarlo.
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
