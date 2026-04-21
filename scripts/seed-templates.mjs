// Carga los 4 templates iniciales en la base de datos.
// Uso: node scripts/seed-templates.mjs

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const BRAND_MODIFIER = `OnMind brand style: clean, professional B2B SaaS aesthetic. Primary color deep teal (#007056), accent (#00876D), light mint background (#E1F3ED), white (#FEFEFE), dark text (#0A0A0A), muted gray (#737373). Typography: modern geometric sans-serif (Geist-style), bold for headlines, medium for body. Photography direction: bright, warm, trustworthy. Mood: calm confidence, professional empathy. The product is a WhatsApp automation platform shown on smartphone screens. All text in Spanish rioplatense. No emojis in design.`;

const CRITICAL_RULES = `
CRITICAL RULES:
- All text must be in Spanish exactly as written above. Do not change any word.
- Do NOT add any logo, watermark, or brand mark anywhere.
- Leave bottom 80px clean/empty for logo overlay in post-production.
- No decorative elements, no patterns, no geometric shapes.`;

const templates = [
  {
    slug: "headline",
    name: "Headline + celular con WhatsApp",
    description:
      "Título impactante arriba, subtítulo en teal, celular con WhatsApp abajo mostrando un mensaje enviado. Ideal para educación y dolor.",
    model: "google/gemini-3-pro-image-preview",
    costPerImage: 0.14,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "headline",
        label: "Título principal",
        type: "text",
        required: true,
        placeholder: "Tu cliente se olvidó de vos. Vos no te olvides de él.",
      },
      {
        key: "subhead",
        label: "Subtítulo",
        type: "text",
        required: true,
        placeholder:
          "OnMind envía mensajes por vos para que ningún vínculo se pierda.",
      },
      {
        key: "phoneMessage",
        label: "Mensaje en pantalla del celular (burbuja WhatsApp)",
        type: "text",
        required: true,
        placeholder:
          "¡Feliz cumpleaños, María! Un abrazo del equipo de la inmobiliaria",
      },
    ],
    promptTemplate: `${BRAND_MODIFIER}

Create: a static ad with a white (#FEFEFE) background, 4:5 portrait format (1080x1350px). Top third: large bold sans-serif headline in dark (#0A0A0A) reading "{{headline}}" Below in smaller medium-weight teal (#007056) text: "{{subhead}}" Bottom half: a modern smartphone (iPhone-style, dark frame) showing a WhatsApp conversation screen with a sent message that reads "{{phoneMessage}}" with a green WhatsApp sent bubble and a double blue checkmark. The phone sits on a clean white surface with soft shadow beneath. Shot at 50mm f/2.8 from slightly above. Clean, authoritative, minimal.
${CRITICAL_RULES}
- The headline must appear EXACTLY ONCE. Do NOT repeat it or any part of it.
- The phone screen must look realistic with WhatsApp UI.`,
  },
  {
    slug: "features-pointout",
    name: "Diagrama educativo: celular + callouts",
    description:
      "Celular con WhatsApp Business en el centro, 4 features con líneas conectoras apuntando al celular. Ideal para producto.",
    model: "google/gemini-3.1-flash-image-preview",
    costPerImage: 0.07,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "headline",
        label: "Título principal",
        type: "text",
        required: true,
        placeholder: "¿Qué hace OnMind por tu negocio?",
      },
      {
        key: "feature1",
        label: "Feature arriba-izquierda",
        type: "text",
        required: true,
        placeholder: "Mensajes de cumpleaños automáticos",
      },
      {
        key: "feature2",
        label: "Feature arriba-derecha",
        type: "text",
        required: true,
        placeholder: "Recordatorios de vencimientos",
      },
      {
        key: "feature3",
        label: "Feature abajo-izquierda",
        type: "text",
        required: true,
        placeholder: "Seguimiento post-venta programado",
      },
      {
        key: "feature4",
        label: "Feature abajo-derecha",
        type: "text",
        required: true,
        placeholder: "Saludos en fechas especiales",
      },
    ],
    promptTemplate: `${BRAND_MODIFIER}

Create: an educational diagram-style ad on white (#FEFEFE) background, 4:5 portrait format (1080x1350px). Top: bold teal (#007056) sans-serif text reading "{{headline}}" in large size. Below: a modern smartphone centered showing a WhatsApp Business interface with a list of scheduled messages, even studio lighting, subtle shadow. Four callout boxes with thin connecting lines pointing to the phone from each side:

Top-left callout: small teal (#007056) circle bullet, bold text "{{feature1}}"
Top-right callout: small teal circle bullet, bold text "{{feature2}}"
Bottom-left callout: small teal circle bullet, bold text "{{feature3}}"
Bottom-right callout: small teal circle bullet, bold text "{{feature4}}"

The connecting lines are thin, elegant, slightly curved, in light gray (#E5E5E5). Callout text in dark (#0A0A0A) sans-serif. Layout feels like a scientific diagram redesigned by a luxury design agency. Generous whitespace.
${CRITICAL_RULES}
- No colored backgrounds on callout boxes — just text and thin lines.
- The phone must look photorealistic with a realistic WhatsApp-like interface.`,
  },
  {
    slug: "us-vs-them",
    name: "Comparación: Manual vs OnMind",
    description:
      "Split vertical: lado izquierdo gris con problemas (X rojas), lado derecho teal con soluciones (checks verdes). Ideal para dolor y producto.",
    model: "google/gemini-3.1-flash-image-preview",
    costPerImage: 0.07,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "leftTitle",
        label: "Título lado izquierdo (el problema)",
        type: "text",
        required: true,
        placeholder: "Gestión manual",
      },
      {
        key: "rightTitle",
        label: "Título lado derecho (la solución)",
        type: "text",
        required: true,
        placeholder: "Con OnMind",
      },
      {
        key: "leftItem1",
        label: "Problema 1",
        type: "text",
        required: true,
        placeholder: "Te olvidás de los cumpleaños",
      },
      {
        key: "leftItem2",
        label: "Problema 2",
        type: "text",
        required: true,
        placeholder: "Perdés el seguimiento a los 3 días",
      },
      {
        key: "leftItem3",
        label: "Problema 3",
        type: "text",
        required: true,
        placeholder: "Copiás y pegás mensajes uno por uno",
      },
      {
        key: "leftItem4",
        label: "Problema 4",
        type: "text",
        required: true,
        placeholder: "Dependés de tu memoria",
      },
      {
        key: "leftItem5",
        label: "Problema 5",
        type: "text",
        required: true,
        placeholder: "Tus clientes se van en silencio",
      },
      {
        key: "rightItem1",
        label: "Solución 1",
        type: "text",
        required: true,
        placeholder: "Saludos automáticos en cada fecha",
      },
      {
        key: "rightItem2",
        label: "Solución 2",
        type: "text",
        required: true,
        placeholder: "Plan de seguimiento que no falla",
      },
      {
        key: "rightItem3",
        label: "Solución 3",
        type: "text",
        required: true,
        placeholder: "Mensajes personalizados y programados",
      },
      {
        key: "rightItem4",
        label: "Solución 4",
        type: "text",
        required: true,
        placeholder: "El sistema recuerda por vos",
      },
      {
        key: "rightItem5",
        label: "Solución 5",
        type: "text",
        required: true,
        placeholder: "Tus clientes sienten que los cuidás",
      },
    ],
    promptTemplate: `${BRAND_MODIFIER}

Create: a side-by-side comparison ad divided vertically, 4:5 portrait format (1080x1350px). Left half: muted warm gray (#F0EDED) background. Right half: deep teal (#007056) background.

Center top: a small white circle with bold "VS" text in dark gray.

Left side header: "{{leftTitle}}" in bold dark (#0A0A0A) sans-serif. Below: a slightly messy desk scene suggestion (subtle, out of focus) with sticky notes. Then a vertical list with red circle X marks:
"{{leftItem1}}"
"{{leftItem2}}"
"{{leftItem3}}"
"{{leftItem4}}"
"{{leftItem5}}"

Right side header: "{{rightTitle}}" in bold white sans-serif. Below: a clean smartphone showing WhatsApp (subtle, out of focus). Then a vertical list with green circle checkmarks:
"{{rightItem1}}"
"{{rightItem2}}"
"{{rightItem3}}"
"{{rightItem4}}"
"{{rightItem5}}"

Text on left side in dark (#0A0A0A), text on right side in white (#FEFEFE). Clean sans-serif typography. Lists have generous line spacing.
${CRITICAL_RULES}
- The X and checkmark should be simple colored circle icons, not emoji.
- Keep it clean and professional, not busy.`,
  },
  {
    slug: "stat-surround",
    name: "Celular + estadísticas radiales",
    description:
      "Celular con conversación WhatsApp en el centro, 4 estadísticas con flechas apuntando al celular. Ideal para educación.",
    model: "google/gemini-3.1-flash-image-preview",
    costPerImage: 0.07,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "headline",
        label: "Título principal",
        type: "text",
        required: true,
        placeholder: "¿Por qué las inmobiliarias eligen OnMind?",
      },
      {
        key: "contactName",
        label: "Nombre del contacto en WhatsApp",
        type: "text",
        required: true,
        placeholder: "María López",
      },
      {
        key: "sentMessage",
        label: "Mensaje enviado (burbuja verde)",
        type: "text",
        required: true,
        placeholder:
          "Hola María, te recordamos que tu contrato vence el 15/05. ¿Coordinamos la renovación?",
      },
      {
        key: "receivedMessage",
        label: "Mensaje recibido (burbuja gris)",
        type: "text",
        required: true,
        placeholder:
          "¡Sí! Justo iba a llamarlos. Gracias por avisar.",
      },
      {
        key: "stat1Value",
        label: "Estadística 1 — valor grande",
        type: "text",
        required: true,
        placeholder: "3x",
      },
      {
        key: "stat1Label",
        label: "Estadística 1 — descripción",
        type: "text",
        required: true,
        placeholder: "más respuestas que un email",
      },
      {
        key: "stat2Value",
        label: "Estadística 2 — valor grande",
        type: "text",
        required: true,
        placeholder: "0",
      },
      {
        key: "stat2Label",
        label: "Estadística 2 — descripción",
        type: "text",
        required: true,
        placeholder: "mensajes olvidados",
      },
      {
        key: "stat3Value",
        label: "Estadística 3 — valor grande",
        type: "text",
        required: true,
        placeholder: "100%",
      },
      {
        key: "stat3Label",
        label: "Estadística 3 — descripción",
        type: "text",
        required: true,
        placeholder: "de cumpleaños recordados",
      },
      {
        key: "stat4Value",
        label: "Estadística 4 — valor grande",
        type: "text",
        required: true,
        placeholder: "5 min",
      },
      {
        key: "stat4Label",
        label: "Estadística 4 — descripción",
        type: "text",
        required: true,
        placeholder: "de setup inicial",
      },
    ],
    promptTemplate: `${BRAND_MODIFIER}

Create: a static ad on a white-to-light-mint (#FEFEFE to #E1F3ED) subtle gradient background, 4:5 portrait format (1080x1350px).

HEADLINE (top 15%):
Large bold dark (#0A0A0A) sans-serif: "{{headline}}"

PHONE (center, 50% of image):
A modern iPhone showing a WhatsApp chat. The screen shows exactly this conversation:
- Contact name at top: "{{contactName}}"
- One green sent bubble reading: "{{sentMessage}}"
- One gray received bubble reading: "{{receivedMessage}}"
- Blue double checkmarks on the sent message.
The phone has soft studio lighting and a subtle shadow.

STATS (flanking the phone, 4 callouts):
Each stat has a thin curved arrow in teal (#007056) pointing toward the phone.

Top-left: "{{stat1Value}}" in oversized bold teal, below in small dark text: "{{stat1Label}}"
Bottom-left: "{{stat2Value}}" in oversized bold teal, below: "{{stat2Label}}"
Top-right: "{{stat3Value}}" in oversized bold teal, below: "{{stat3Label}}"
Bottom-right: "{{stat4Value}}" in oversized bold teal, below: "{{stat4Label}}"

Arrows are thin, slightly curved, editorial style. Not thick or decorative.
${CRITICAL_RULES}
- The WhatsApp conversation must show exactly the messages specified above.
- The phone screen must look realistic.`,
  },
  {
    slug: "whatsapp-conversation",
    name: "Conversación WhatsApp de 2 rondas",
    description:
      "Celular grande con una conversación WhatsApp completa: dos rondas separadas por fechas, mostrando cómo OnMind mantiene el vínculo en el tiempo. Soporta light/dark mode. Ideal para producto y educación.",
    model: "google/gemini-3-pro-image-preview",
    costPerImage: 0.14,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "headline",
        label: "Título principal",
        type: "text",
        required: true,
        placeholder: "Los clientes no se van — se quedan si te quedás vos.",
      },
      {
        key: "subhead",
        label: "Subtítulo",
        type: "text",
        required: true,
        placeholder: "OnMind dispara los mensajes que mantienen el vínculo vivo.",
      },
      {
        key: "theme",
        label: "Modo del chat (light | dark)",
        type: "text",
        required: true,
        placeholder: "light",
      },
      {
        key: "contactName",
        label: "Nombre del contacto en el header",
        type: "text",
        required: true,
        placeholder: "Martín Gómez",
      },
      {
        key: "dateLabel1",
        label: "Separador de fecha 1 (ronda inicial)",
        type: "text",
        required: true,
        placeholder: "vie, 19 dic.",
      },
      {
        key: "sentMessage1",
        label: "Mensaje enviado 1 (disparado por OnMind)",
        type: "text",
        required: true,
        placeholder:
          "Hola Martín, ¿cómo va todo con la casa? ¿Alguna duda con los servicios o la mudanza?",
      },
      {
        key: "receivedMessage1",
        label: "Respuesta del cliente 1",
        type: "text",
        required: true,
        placeholder: "¡Todo bien, gracias! Cualquier cosa te escribo.",
      },
      {
        key: "dateLabel2",
        label: "Separador de fecha 2 (reactivación)",
        type: "text",
        required: true,
        placeholder: "lun, 6 abr.",
      },
      {
        key: "sentMessage2",
        label: "Mensaje enviado 2 (segundo disparo de OnMind)",
        type: "text",
        required: true,
        placeholder:
          "Hola Martín, hace unos meses que no hablamos. ¿Cómo andás? ¿Todo en orden con la casa?",
      },
      {
        key: "receivedMessage2",
        label: "Respuesta del cliente 2",
        type: "text",
        required: true,
        placeholder:
          "Justo iba a escribirte — un conocido busca un alquiler por la zona. ¿Tenés algo?",
      },
    ],
    promptTemplate: `${BRAND_MODIFIER}

Create: a static ad in 4:5 portrait format (1080x1350px) on a pure white (#FEFEFE) background.

TOP SECTION (top 18% of canvas):
Bold dark (#0A0A0A) sans-serif headline reading "{{headline}}", maximum 2 lines, tight line-height. Below in medium-weight teal (#007056) sans-serif: "{{subhead}}", maximum 2 lines.

PHONE (bottom 72% of canvas):
A modern smartphone (iPhone-style, dark frame) shown vertically (portrait orientation), centered horizontally, filling most of the bottom area. Shot straight-on at 50mm f/2.8. Soft shadow beneath. The phone MUST be portrait, never landscape or rotated.

PHONE SCREEN — WhatsApp conversation in {{theme}} mode:

CHAT HEADER (top bar of phone screen):
- Left: small back arrow icon.
- Circular profile photo (realistic, looks like a real contact — a generic friendly adult headshot, neutral, professional).
- Contact name in bold: "{{contactName}}".
- Small subtle status text below the name: "en línea".
- Right side of header: small video call and phone call icons.
- Header background color matches the theme (light green in light mode, darker charcoal in dark mode).

CHAT BACKGROUND (main area of the screen):
- If {{theme}} is "light": classic WhatsApp cream/beige background (#ECE5DD) with the faint tiny doodle icons pattern.
- If {{theme}} is "dark": WhatsApp dark chat background (#0B141A) with barely visible darker doodle pattern.

CONVERSATION CONTENT (must fit entirely on screen, no scrolling):
Render exactly these 6 elements from top to bottom, in this order:

1. Centered date separator pill (small rounded rectangle, light gray pill in light mode / dark gray pill in dark mode) with text: "{{dateLabel1}}"
2. Sent bubble (aligned to the RIGHT, WhatsApp green #DCF8C6 in light mode or #005C4B in dark mode), text: "{{sentMessage1}}". Small timestamp inside the bottom-right of the bubble, followed by double blue checkmark.
3. Received bubble (aligned to the LEFT, white #FFFFFF in light mode or #202C33 in dark mode), text: "{{receivedMessage1}}". Small timestamp inside the bottom-right of the bubble.
4. Centered date separator pill with text: "{{dateLabel2}}"
5. Sent bubble (aligned RIGHT, same green as before), text: "{{sentMessage2}}". Timestamp + double blue checkmark.
6. Received bubble (aligned LEFT, same white/dark as before), text: "{{receivedMessage2}}". Timestamp.

Bubble typography: clean sans-serif, tight line-height, realistic WhatsApp bubble shapes with small tails on the first bubble of each turn. Generous but realistic spacing. Bubble text color: dark #0A0A0A in light mode, light #E9EDEF in dark mode.
${CRITICAL_RULES}
- All text in bubbles, header, and date separators must be in Spanish exactly as written above. Do not change any word.
- The smartphone MUST be shown vertically (portrait orientation), never horizontal or rotated.
- The WhatsApp UI must look realistic and match the specified theme ({{theme}}).
- All 6 conversation elements (2 date separators, 2 sent bubbles, 2 received bubbles) must be visible on the phone screen without scrolling.
- Sent bubbles ALWAYS on the right. Received bubbles ALWAYS on the left.
- Do NOT include real brand names, phone numbers, or personal identifiers beyond those provided.
- Headline must appear EXACTLY ONCE at the top.`,
  },
  {
    slug: "carta-fundador",
    name: "Carta del fundador / Manifiesto",
    description:
      "Pieza editorial tipo carta — solo texto, sin celular. Opening potente + cuerpo corto en voz de fundador + firma. Render programático (Satori), cero costo. Ideal para detrás de escena y declaraciones fuertes de dolor.",
    renderer: "SATORI",
    model: null,
    costPerImage: 0,
    darkOverlay: false,
    aspectRatio: "4:5",
    fields: [
      {
        key: "opening",
        label: "Frase de apertura (hook)",
        type: "text",
        required: true,
        placeholder:
          "Los clientes no se van porque encontraron algo mejor.",
      },
      {
        key: "body",
        label: "Cuerpo de la carta (50–80 palabras, 2–3 párrafos cortos)",
        type: "textarea",
        required: true,
        placeholder:
          "Se van porque te olvidaste de ellos. Pasaron meses. No les escribiste en su cumpleaños. No les preguntaste cómo andaba la casa. Cuando te necesitaron, ya estaban con otro.\n\nOnMind nació para que eso no te vuelva a pasar.",
      },
      {
        key: "signature",
        label: "Firma",
        type: "text",
        required: true,
        placeholder: "— Martín, fundador de OnMind",
      },
    ],
    promptTemplate: null,
  },
];

async function main() {
  console.log("Cargando templates...\n");

  for (const t of templates) {
    const existing = await prisma.template.findUnique({
      where: { slug: t.slug },
    });

    if (existing) {
      await prisma.template.update({
        where: { slug: t.slug },
        data: t,
      });
      console.log(`  ✏️  Actualizado: ${t.slug}`);
    } else {
      await prisma.template.create({ data: t });
      console.log(`  ✅ Creado: ${t.slug}`);
    }
  }

  const count = await prisma.template.count();
  console.log(`\n${count} templates en la base.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
