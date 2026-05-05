// Lista voces disponibles para la API key.
import fs from "node:fs";

function loadEnvLocal(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
loadEnvLocal("/home/raphael/desarrollo/onmind-marketing/.env.local");

const res = await fetch("https://api.elevenlabs.io/v2/voices", {
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
});
const data = await res.json();

const voices = data.voices || [];
console.log(`Total voces: ${voices.length}\n`);
for (const v of voices) {
  const langs = v.verified_languages?.map((l) => l.language).join(",") || v.labels?.language || "?";
  console.log(`${v.voice_id}  [${v.category}]  ${v.name}  (${langs})  ${v.labels?.gender || ""} ${v.labels?.accent || ""}`);
}
