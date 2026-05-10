"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { createLead } from "@/services/lead-service"
import { LeadSource } from "@prisma/client"

const createLeadSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  source: z.nativeEnum(LeadSource),
  businessType: z.string().optional(),
})

export type CreateLeadFormState = {
  error?: string
  fieldErrors?: Record<string, string>
}

export async function createLeadAction(
  _prev: CreateLeadFormState,
  formData: FormData
): Promise<CreateLeadFormState> {
  const session = await auth()

  const parsed = createLeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    source: formData.get("source") || "WEB",
    businessType: formData.get("businessType") || undefined,
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string") fieldErrors[key] = issue.message
    }
    return { error: "Revisá los campos", fieldErrors }
  }

  const lead = await createLead({
    ...parsed.data,
    authorUserId: session?.user?.id,
  })

  revalidatePath("/dashboard/leads")
  redirect(`/dashboard/leads/${lead.id}`)
}
