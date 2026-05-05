// Genera voz TTS con ElevenLabs API.
// Uso: node tts.mjs <voice_id> <input_text_file> <output_mp3>

import fs from "node:fs";
import path from "node:path";

function loadEnvLocal(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const ROOT_ENV = "/home/raphael/desarrollo/onmind-marketing/.env.local";
loadEnvLocal(ROOT_ENV);

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Falta ELEVENLABS_API_KEY en .env.local del proyecto");
  process.exit(1);
}

const [voiceId, textFile, outputFile] = process.argv.slice(2);
if (!voiceId || !textFile || !outputFile) {
  console.error("Uso: node tts.mjs <voice_id> <input_text_file> <output_mp3>");
  process.exit(1);
}

const text = fs.readFileSync(textFile, "utf8").trim();
console.log(`Texto: ${text.length} caracteres`);
console.log(`Voice: ${voiceId}`);

const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
const body = {
  text,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.3,
    use_speaker_boost: true,
  },
};

console.log("Llamando ElevenLabs TTS...");
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
