// Obtiene timestamps palabra-a-palabra usando Forced Alignment de ElevenLabs.
// Uso: node align.mjs <audio_mp3> <text_file> <output_json>

import fs from "node:fs";

function loadEnvLocal(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
loadEnvLocal("/home/raphael/desarrollo/onmind-marketing/.env.local");

const apiKey = process.env.ELEVENLABS_API_KEY;
const [audioFile, textFile, outputJson] = process.argv.slice(2);
if (!audioFile || !textFile || !outputJson) {
  console.error("Uso: node align.mjs <audio_mp3> <text_file> <output_json>");
  process.exit(1);
}

const audio = fs.readFileSync(audioFile);
const text = fs.readFileSync(textFile, "utf8").trim();

const form = new FormData();
form.append("file", new Blob([audio], { type: "audio/mpeg" }), "audio.mp3");
form.append("text", text);

console.log("Llamando Forced Alignment...");
const t0 = Date.now();
const res = await fetch("https://api.elevenlabs.io/v1/forced-alignment", {
  method: "POST",
  headers: { "xi-api-key": apiKey },
  body: form,
});

if (!res.ok) {
  console.error(`Error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
fs.writeFileSync(outputJson, JSON.stringify(data, null, 2));
console.log(`OK: ${outputJson} (${Date.now() - t0} ms)`);
console.log(`Words: ${data.words?.length || 0}`);
if (data.words?.length) {
  console.log(`Primera: "${data.words[0].text}" @ ${data.words[0].start}s`);
  console.log(`Última: "${data.words.at(-1).text}" @ ${data.words.at(-1).end}s`);
}
