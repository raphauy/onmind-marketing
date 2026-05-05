// Genera música ambient con ElevenLabs Music API.
// Uso: node music.mjs <duration_ms> <output_mp3>

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
if (!apiKey) {
  console.error("Falta ELEVENLABS_API_KEY");
  process.exit(1);
}

const [durationMs, outputFile] = process.argv.slice(2);
if (!durationMs || !outputFile) {
  console.error("Uso: node music.mjs <duration_ms> <output_mp3>");
  process.exit(1);
}

const prompt =
  "Modern minimal tech background music. Subtle electronic pulse with a steady understated beat. " +
  "Soft analog synth bass, gentle high-end shimmer, light percussive ticks. " +
  "Confident professional energy, momentum without being aggressive. " +
  "Designed to sit under a Spanish narration about business data. " +
  "Inspired by Apple keynote underscores and modern tech product videos. No vocals.";

console.log(`Generando música: ${durationMs}ms`);
console.log(`Prompt: ${prompt.slice(0, 80)}...`);

const url = "https://api.elevenlabs.io/v1/music";
const body = {
  prompt,
  music_length_ms: Number(durationMs),
};

const t0 = Date.now();
const res = await fetch(url, {
  method: "POST",
  headers: {
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "audio/mpeg",
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const errText = await res.text();
  console.error(`Error ${res.status}: ${errText}`);
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, buf);
const ms = Date.now() - t0;
const kb = Math.round(buf.length / 1024);
console.log(`OK: ${outputFile} (${kb} KB, ${ms} ms)`);
