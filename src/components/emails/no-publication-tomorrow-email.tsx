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
  missingDays: string[]
  scheduleUrl: string
  appName?: string
}

export default function NoPublicationTomorrowEmail({
  missingDays = ["hoy"],
  scheduleUrl = "https://marketing.onmindcrm.com/dashboard/pieces",
  appName = "OnMind Marketing",
}: Props) {
  const daysText =
    missingDays.length === 1
      ? missingDays[0]
      : missingDays.join(" y ")

  return (
    <Html>
      <Head />
      <Preview>{`Sin publicación programada en Instagram para ${daysText}`}</Preview>
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
                    Instagram sin contenido programado
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
                  Falta programar
                </Heading>
                <Text
                  style={{
                    color: ONMIND_EMAIL_COLORS.textPrimary,
                    fontSize: "15px",
                    lineHeight: "1.5",
                    margin: "0 0 18px 0",
                  }}
                >
                  No hay publicaciones de Instagram para{" "}
                  <strong>{daysText}</strong>.
                </Text>

                <Section style={EMAIL_INLINE_STYLES.dataSection}>
                  {missingDays.map((day) => (
                    <Text
                      key={day}
                      style={{
                        color: ONMIND_EMAIL_COLORS.textPrimary,
                        fontSize: "14px",
                        margin: "4px 0",
                      }}
                    >
                      •{" "}
                      <strong style={{ color: ONMIND_EMAIL_COLORS.warning }}>
                        {day}
                      </strong>{" "}
                      sin contenido programado
                    </Text>
                  ))}
                </Section>

                <Section className="text-center">
                  <Button
                    href={scheduleUrl}
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
                    Abrir piezas
                  </Button>
                </Section>

                <Text style={EMAIL_INLINE_STYLES.explanatoryNote}>
                  Chequeo automático todas las mañanas a las 6 am de UY.
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
