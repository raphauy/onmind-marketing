// Genera música ambient con ElevenLabs Music API.
//
// Uso:
//   node music.mjs <duration_ms> <output_mp3> [--prompt "texto"]
//
// Sin --prompt usa el default ambient corporate (apto para narración de datos).

import fs from "node:fs";
import path from "node:path";

function loadEnvLocal(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
loadEnvLocal("/home/raphael/desarrollo/onmind-marketing/.env.local");

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) { console.error("Falta ELEVENLABS_API_KEY"); process.exit(1); }

const args = process.argv.slice(2);
const promptIdx = args.indexOf("--prompt");
let customPrompt = null;
if (promptIdx !== -1 && args[promptIdx + 1]) {
  customPrompt = args[promptIdx + 1];
  args.splice(promptIdx, 2);
}
const [durationMs, outputFile] = args;
if (!durationMs || !outputFile) {
  console.error("Uso: node music.mjs <duration_ms> <output_mp3> [--prompt \"texto\"]");
  process.exit(1);
}

const defaultPrompt =
  "Modern minimal tech background music. Subtle electronic pulse with a steady understated beat. " +
  "Soft analog synth bass, gentle high-end shimmer, light percussive ticks. " +
  "Confident professional energy, momentum without being aggressive. " +
  "Designed to sit under a Spanish narration about business data. " +
  "Inspired by Apple keynote underscores and modern tech product videos. No vocals.";

const prompt = customPrompt ?? defaultPrompt;
console.log(`Duration: ${durationMs}ms`);
console.log(`Prompt: ${prompt.slice(0, 100)}...`);

const t0 = Date.now();
const res = await fetch("https://api.elevenlabs.io/v1/music", {
  method: "POST",
  headers: {
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "audio/mpeg",
  },
  body: JSON.stringify({ prompt, music_length_ms: Number(durationMs) }),
});
if (!res.ok) { console.error(`Error ${res.status}: ${await res.text()}`); process.exit(1); }

const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, buf);
console.log(`OK: ${outputFile} (${Math.round(buf.length / 1024)} KB, ${Date.now() - t0} ms)`);
