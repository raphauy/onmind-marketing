import { prisma } from "@/lib/prisma"
import {
  MessageTemplate,
  MessageTemplateChannel,
  MessageTemplatePurpose,
} from "@prisma/client"

// ── Defaults ──────────────────────────────────────────────────────
// Tono OnMind: directo, en español, sin formalidades, sin em dash.
// Variables: {nombre} y, solo en BOOKING_LINK, {linkBooking}.

type DefaultTemplate = { subject?: string; body: string }

const DEFAULTS: Record<
  MessageTemplatePurpose,
  Record<MessageTemplateChannel, DefaultTemplate>
> = {
  BOOKING_LINK: {
    EMAIL: {
      subject: "Demo de OnMind",
      body: `Hola {nombre}, gracias por escribirnos.

Te paso el link para que elijas día y horario para la demo: {linkBooking}

La demo dura 20 minutos y la hacemos por Google Meet. Cualquier duda me decís.`,
    },
    WHATSAPP: {
      body: `Hola {nombre}, te paso el link para agendar la demo cuando te quede cómodo: {linkBooking}

La demo dura 20 minutos y la hacemos por Google Meet.`,
    },
  },
  FOLLOWUP_CONTACTED: {
    EMAIL: {
      subject: "Quedó pendiente tu demo de OnMind",
      body: `Hola {nombre}, te quedó pendiente lo de la demo. Te dejo el link por las dudas, cuando puedas elegís y listo.

{linkBooking}`,
    },
    WHATSAPP: {
      body: `Hola {nombre}, te quedó pendiente lo de la demo. Te dejo el link por las dudas, cuando puedas elegís y listo.

{linkBooking}`,
    },
  },
  FOLLOWUP_DEMO_DONE: {
    EMAIL: {
      subject: "¿Cómo viste la demo de OnMind?",
      body: `Hola {nombre}, ¿tuviste un rato para pensarlo? Cualquier duda que te haya quedado la resolvemos por acá.

Si querés arrancamos cuando te quede cómodo.`,
    },
    WHATSAPP: {
      body: `Hola {nombre}, ¿tuviste un rato para pensarlo? Cualquier duda que te haya quedado la resolvemos por acá. Si querés arrancamos cuando te quede cómodo.`,
    },
  },
  CHECKIN_CUSTOMER_MONTH_1: {
    EMAIL: {
      subject: "¿Cómo va con OnMind?",
      body: `Hola {nombre}, vamos por la mitad del primer mes con OnMind. ¿Cómo lo estás viendo?

Cualquier ajuste o duda me decís y lo vemos.`,
    },
    WHATSAPP: {
      body: `Hola {nombre}, vamos por la mitad del primer mes con OnMind. ¿Cómo lo estás viendo? Cualquier ajuste me decís.`,
    },
  },
}

export const PURPOSE_LABEL: Record<MessageTemplatePurpose, string> = {
  BOOKING_LINK: "Link de booking",
  FOLLOWUP_CONTACTED: "Follow-up · Contactado sin respuesta",
  FOLLOWUP_DEMO_DONE: "Follow-up · Demo realizada sin avanzar",
  CHECKIN_CUSTOMER_MONTH_1: "Check-in cliente · Mitad del primer mes",
}

// Etiqueta corta para tabs / chips, donde el espacio es escaso.
export const PURPOSE_SHORT_LABEL: Record<MessageTemplatePurpose, string> = {
  BOOKING_LINK: "Booking",
  FOLLOWUP_CONTACTED: "Sin respuesta",
  FOLLOWUP_DEMO_DONE: "Post demo",
  CHECKIN_CUSTOMER_MONTH_1: "Check-in",
}

export const PURPOSE_DESCRIPTION: Record<MessageTemplatePurpose, string> = {
  BOOKING_LINK:
    "Mensaje para mandar el link y que el lead elija día y hora de la demo.",
  FOLLOWUP_CONTACTED:
    "Para reactivar a un lead que recibió el primer mensaje y no responde.",
  FOLLOWUP_DEMO_DONE:
    "Para leads que ya hicieron la demo y todavía no avanzaron.",
  CHECKIN_CUSTOMER_MONTH_1:
    "Mensaje amistoso a mitad del primer mes como cliente, para ver cómo va.",
}

export const PURPOSE_ORDER: MessageTemplatePurpose[] = [
  "BOOKING_LINK",
  "FOLLOWUP_CONTACTED",
  "FOLLOWUP_DEMO_DONE",
  "CHECKIN_CUSTOMER_MONTH_1",
]

export type ResolvedTemplate = {
  channel: MessageTemplateChannel
  purpose: MessageTemplatePurpose
  subject: string | null
  body: string
  isDefault: boolean
}

// Devuelve los 8 templates del usuario (4 propósitos × 2 canales).
// Si no hay registro persistido, devuelve el default sin escribir en DB.
export async function getTemplatesForUser(
  userId: string
): Promise<ResolvedTemplate[]> {
  const persisted = await prisma.messageTemplate.findMany({
    where: { userId },
  })

  const byKey = new Map<string, MessageTemplate>()
  for (const t of persisted) {
    byKey.set(`${t.channel}:${t.purpose}`, t)
  }

  const out: ResolvedTemplate[] = []
  for (const purpose of PURPOSE_ORDER) {
    for (const channel of ["EMAIL", "WHATSAPP"] as const) {
      const found = byKey.get(`${channel}:${purpose}`)
      if (found) {
        out.push({
          channel,
          purpose,
          subject: found.subject,
          body: found.body,
          isDefault: false,
        })
      } else {
        const def = DEFAULTS[purpose][channel]
        out.push({
          channel,
          purpose,
          subject: def.subject ?? null,
          body: def.body,
          isDefault: true,
        })
      }
    }
  }
  return out
}

export async function getTemplateForUser(
  userId: string,
  channel: MessageTemplateChannel,
  purpose: MessageTemplatePurpose
): Promise<ResolvedTemplate> {
  const found = await prisma.messageTemplate.findUnique({
    where: { userId_channel_purpose: { userId, channel, purpose } },
  })
  if (found) {
    return {
      channel,
      purpose,
      subject: found.subject,
      body: found.body,
      isDefault: false,
    }
  }
  const def = DEFAULTS[purpose][channel]
  return {
    channel,
    purpose,
    subject: def.subject ?? null,
    body: def.body,
    isDefault: true,
  }
}

export async function upsertTemplate(input: {
  userId: string
  channel: MessageTemplateChannel
  purpose: MessageTemplatePurpose
  subject?: string | null
  body: string
}) {
  const subjectValue = input.channel === "EMAIL" ? input.subject ?? null : null
  return prisma.messageTemplate.upsert({
    where: {
      userId_channel_purpose: {
        userId: input.userId,
        channel: input.channel,
        purpose: input.purpose,
      },
    },
    create: {
      userId: input.userId,
      channel: input.channel,
      purpose: input.purpose,
      subject: subjectValue,
      body: input.body,
    },
    update: {
      subject: subjectValue,
      body: input.body,
    },
  })
}

export async function resetTemplateToDefault(input: {
  userId: string
  channel: MessageTemplateChannel
  purpose: MessageTemplatePurpose
}) {
  await prisma.messageTemplate
    .delete({
      where: {
        userId_channel_purpose: {
          userId: input.userId,
          channel: input.channel,
          purpose: input.purpose,
        },
      },
    })
    .catch(() => null)
}

// Reemplaza variables en un template.
export function interpolate(
  text: string,
  vars: { nombre?: string; linkBooking?: string }
): string {
  return text
    .replaceAll("{nombre}", vars.nombre ?? "")
    .replaceAll("{linkBooking}", vars.linkBooking ?? "")
}
