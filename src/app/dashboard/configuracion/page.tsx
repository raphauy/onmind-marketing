import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  getTemplatesForUser,
  PURPOSE_DESCRIPTION,
  PURPOSE_LABEL,
  PURPOSE_ORDER,
  PURPOSE_SHORT_LABEL,
} from "@/services/message-template-service"
import { TemplatesEditor } from "./templates-editor"

export const dynamic = "force-dynamic"

export default async function ConfiguracionPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const templates = await getTemplatesForUser(session.user.id)

  const byPurpose = PURPOSE_ORDER.map((purpose) => ({
    purpose,
    shortLabel: PURPOSE_SHORT_LABEL[purpose],
    label: PURPOSE_LABEL[purpose],
    description: PURPOSE_DESCRIPTION[purpose],
    email: templates.find(
      (t) => t.purpose === purpose && t.channel === "EMAIL"
    )!,
    whatsapp: templates.find(
      (t) => t.purpose === purpose && t.channel === "WHATSAPP"
    )!,
  }))

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Mis mensajes</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Plantillas de email y WhatsApp para usar con leads. Cada uno tiene su
        propio set. Variables: <code>{"{nombre}"}</code> en todos,{" "}
        <code>{"{linkBooking}"}</code> en booking y follow-up,{" "}
        <code>{"{linkBrochure}"}</code> en cualquiera (URL del brochure de
        OnMind).
      </p>

      <TemplatesEditor groups={byPurpose} />
    </div>
  )
}
