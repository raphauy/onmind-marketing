import { LeadStatus, MessageTemplatePurpose } from "@prisma/client"

// URL pública del brochure de OnMind, para usar como `{linkBrochure}` en las
// plantillas de mensajes. Si se actualiza la versión del brochure, cambiar
// acá y se propaga a todas las plantillas.
export const BROCHURE_URL =
  "https://marketing.onmindcrm.com/presentacion/onmind-brochure.pdf"

// Días desde la última actualización del Lead (lead.updatedAt) que disparan
// el follow-up automático para cada estado. Si pasan más días sin movimiento
// y el lead sigue en ese estado, el cron crea un LeadFollowUp.
export const FOLLOWUP_RULES: Partial<
  Record<
    LeadStatus,
    { daysSinceUpdate: number; suggestedTemplate: MessageTemplatePurpose }
  >
> = {
  CONTACTED: {
    daysSinceUpdate: 3,
    suggestedTemplate: "FOLLOWUP_CONTACTED",
  },
  DEMO_DONE: {
    daysSinceUpdate: 5,
    suggestedTemplate: "FOLLOWUP_DEMO_DONE",
  },
  CUSTOMER: {
    daysSinceUpdate: 15,
    suggestedTemplate: "CHECKIN_CUSTOMER_MONTH_1",
  },
}

export const FOLLOWUP_TRIGGER_STATES = Object.keys(
  FOLLOWUP_RULES
) as LeadStatus[]
