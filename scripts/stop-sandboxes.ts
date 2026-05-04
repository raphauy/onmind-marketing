// Para todos los Vercel Sandboxes en estado "running" del proyecto.
// Útil después de fallos en create-remotion-snapshot que dejan VMs vivas.
//
// Uso: pnpm tsx scripts/stop-sandboxes.ts

import dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })

async function main() {
  const { Sandbox } = await import("@vercel/sandbox")

  const { json } = await Sandbox.list()
  const running = json.sandboxes.filter((s) => s.status === "running")

  if (running.length === 0) {
    console.log("No hay sandboxes running.")
    return
  }

  console.log(`Apagando ${running.length} sandbox(es) running…`)
  for (const summary of running) {
    // El SDK no tipea sandboxId en SandboxSummary públicamente — buscamos
    // el id en los keys conocidos. Vercel devuelve `id` en la response.
    const id =
      (summary as { sandboxId?: string }).sandboxId ??
      (summary as { id?: string }).id
    if (!id) {
      console.log("  ✗ summary sin id:", JSON.stringify(summary).slice(0, 120))
      continue
    }
    try {
      const sandbox = await Sandbox.get({ sandboxId: id })
      await sandbox.stop()
      console.log(`  ✓ ${id}`)
    } catch (e) {
      console.log(`  ✗ ${id}: ${(e as Error).message}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
