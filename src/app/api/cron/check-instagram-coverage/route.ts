import { checkInstagramCoverageNextTwoDays } from "@/services/scheduling-service"
import { sendNoPublicationTomorrowEmail } from "@/services/email-service"

export const maxDuration = 60
export const dynamic = "force-dynamic"

const ALERT_TO = "rapha.uy@rapha.uy"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || auth !== expected) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const result = await checkInstagramCoverageNextTwoDays()

    if (result.missingDays.length > 0) {
      await sendNoPublicationTomorrowEmail({
        to: [ALERT_TO],
        missingDays: result.missingDays,
      })
    }

    return Response.json({
      ok: true,
      ...result,
      emailSent: result.missingDays.length > 0,
      at: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
