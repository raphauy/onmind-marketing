import { publishDuePublications } from "@/services/scheduling-service"

export const maxDuration = 300
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || auth !== expected) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const result = await publishDuePublications()
    return Response.json({ ok: true, ...result, at: new Date().toISOString() })
  } catch (error) {
    return Response.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
