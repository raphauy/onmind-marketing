import { LeadStatus, MessageTemplatePurpose } from "@prisma/client"

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
