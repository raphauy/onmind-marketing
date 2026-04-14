import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FONTS_DIR = join(ROOT, "node_modules/geist/dist/fonts/geist-sans");
const OUTPUT_DIR = join(ROOT, "output/pendientes");

// Brand tokens
const brand = {
  primary: "#007056",
  primaryHover: "#00876D",
  primaryLight: "#00AB89",
  primaryDark: "#004A37",
  accentBg: "#E1F3ED",
  foreground: "#0A0A0A",
  muted: "#737373",
  border: "#E5E5E5",
  surface: "#F4F4F4",
  background: "#FEFEFE",
  white: "#FFFFFF",
};

// Load fonts
const geistBold = readFileSync(join(FONTS_DIR, "Geist-Bold.ttf"));
const geistMedium = readFileSync(join(FONTS_DIR, "Geist-Medium.ttf"));
const geistRegular = readFileSync(join(FONTS_DIR, "Geist-Regular.ttf"));
const geistBlack = readFileSync(join(FONTS_DIR, "Geist-Black.ttf"));
const geistSemiBold = readFileSync(join(FONTS_DIR, "Geist-SemiBold.ttf"));

const fonts = [
  { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
  { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
  { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
  { name: "Geist", data: geistBold, weight: 700, style: "normal" },
  { name: "Geist", data: geistBlack, weight: 900, style: "normal" },
];

// Load isotipo versions for embedding
const isotipoPng = readFileSync(
  join(ROOT, "assets/logo/isotipo-OnMind-transparente.png")
);
const isotipoBase64 = `data:image/png;base64,${isotipoPng.toString("base64")}`;

const isotipoBlancoPng = readFileSync(
  join(ROOT, "assets/logo/isotipo-OnMind-blanco.png")
);
const isotipoBlanco = `data:image/png;base64,${isotipoBlancoPng.toString("base64")}`;

// ── Templates ──────────────────────────────────────────────────

function templateEducacion({ titulo, subtexto, pieFrase }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: brand.white,
        padding: 80,
        fontFamily: "Geist",
      },
      children: [
        // Tag superior
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 40,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 8,
                    height: 32,
                    backgroundColor: brand.primary,
                    borderRadius: 4,
                  },
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: 28,
                    fontWeight: 600,
                    color: brand.primary,
                    letterSpacing: "0.05em",
                  },
                  children: "TIP",
                },
              },
            ],
          },
        },
        // Titulo
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: 64,
                    fontWeight: 900,
                    color: brand.foreground,
                    lineHeight: 1.15,
                    margin: 0,
                  },
                  children: titulo,
                },
              },
              subtexto
                ? {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 32,
                        fontWeight: 400,
                        color: brand.muted,
                        lineHeight: 1.5,
                        marginTop: 30,
                      },
                      children: subtexto,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Footer: frase + logo
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            },
            children: [
              pieFrase
                ? {
                    type: "span",
                    props: {
                      style: {
                        fontSize: 24,
                        fontWeight: 500,
                        color: brand.muted,
                      },
                      children: pieFrase,
                    },
                  }
                : { type: "div", props: {} },
              {
                type: "img",
                props: {
                  src: isotipoBase64,
                  width: 80,
                  height: 80,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function templateDolor({ titulo, subtexto }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: brand.primary,
        padding: 80,
        fontFamily: "Geist",
      },
      children: [
        // Comillas decorativas
        {
          type: "span",
          props: {
            style: {
              fontSize: 120,
              fontWeight: 900,
              color: brand.primaryLight,
              lineHeight: 0.8,
              marginBottom: 10,
              opacity: 0.4,
            },
            children: "\u201C",
          },
        },
        // Contenido central
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: 56,
                    fontWeight: 700,
                    color: brand.white,
                    lineHeight: 1.25,
                    margin: 0,
                  },
                  children: titulo,
                },
              },
              subtexto
                ? {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 30,
                        fontWeight: 400,
                        color: brand.accentBg,
                        lineHeight: 1.5,
                        marginTop: 30,
                        opacity: 0.85,
                      },
                      children: subtexto,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Footer
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: 24,
                    fontWeight: 500,
                    color: brand.accentBg,
                    opacity: 0.7,
                  },
                  children: "@OnMindApp",
                },
              },
              {
                type: "img",
                props: {
                  src: isotipoBlanco,
                  width: 80,
                  height: 80,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function templateProducto({ titulo, subtexto, feature }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: brand.surface,
        padding: 80,
        fontFamily: "Geist",
      },
      children: [
        // Badge feature
        feature
          ? {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  marginBottom: 30,
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        backgroundColor: brand.accentBg,
                        borderRadius: 20,
                        padding: "8px 20px",
                        fontSize: 22,
                        fontWeight: 600,
                        color: brand.primary,
                        border: `1.5px solid ${brand.primaryLight}`,
                      },
                      children: feature,
                    },
                  },
                ],
              },
            }
          : null,
        // Contenido
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: 58,
                    fontWeight: 900,
                    color: brand.foreground,
                    lineHeight: 1.2,
                    margin: 0,
                  },
                  children: titulo,
                },
              },
              subtexto
                ? {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 30,
                        fontWeight: 400,
                        color: brand.muted,
                        lineHeight: 1.5,
                        marginTop: 30,
                      },
                      children: subtexto,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Línea decorativa + logo
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 20,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "100%",
                    height: 3,
                    backgroundColor: brand.primary,
                    opacity: 0.2,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: 24,
                          fontWeight: 500,
                          color: brand.muted,
                        },
                        children: "@OnMindApp",
                      },
                    },
                    {
                      type: "img",
                      props: {
                        src: isotipoBase64,
                        width: 80,
                        height: 80,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// ── Render engine ──────────────────────────────────────────────

const TEMPLATES = {
  educacion: templateEducacion,
  dolor: templateDolor,
  producto: templateProducto,
};

async function renderPost(template, data, filename) {
  const templateFn = TEMPLATES[template];
  if (!templateFn) {
    console.error(`Template "${template}" no encontrado. Disponibles: ${Object.keys(TEMPLATES).join(", ")}`);
    process.exit(1);
  }

  const element = templateFn(data);

  const svg = await satori(element, {
    width: 1080,
    height: 1350,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1080 },
  });
  const png = resvg.render().asPng();

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = join(OUTPUT_DIR, `${filename}.png`);
  writeFileSync(outputPath, png);
  console.log(`✓ ${outputPath}`);
  return outputPath;
}

// ── CLI ────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args[0] === "--test") {
  // Genera posts de prueba para validar los templates
  await renderPost("educacion", {
    titulo: "No esperes a que tu cliente te busque. Escribile vos primero.",
    subtexto:
      "Un mensaje a tiempo vale más que diez cuando ya se fue con otro.",
    pieFrase: "@OnMindApp",
  }, "test-educacion");

  await renderPost("dolor", {
    titulo: "Se me venció el alquiler de un cliente y me enteré por él.",
    subtexto:
      "Cuando te acordás tarde, el cliente ya lo resolvió con otro. OnMind te avisa antes.",
  }, "test-dolor");

  await renderPost("producto", {
    titulo: "Programá un saludo de cumpleaños para cada cliente. En 2 minutos.",
    subtexto:
      "OnMind envía el mensaje el día exacto, con el nombre del cliente. Vos no tenés que hacer nada.",
    feature: "Mensajes programados",
  }, "test-producto");

  console.log("\n3 posts de prueba generados en output/pendientes/");
} else if (args[0] === "--all") {
  // Genera los 9 posts del batch de lanzamiento
  const batch = [
    { template: "educacion", filename: "01-educacion-escribile-primero", data: {
      titulo: "No esperes a que tu cliente te busque. Escribile vos primero.",
      subtexto: "Un mensaje a tiempo vale más que diez cuando ya se fue con otro.",
      pieFrase: "@OnMindApp",
    }},
    { template: "producto", filename: "02-producto-conecta-whatsapp", data: {
      titulo: "Conectá tu WhatsApp y empezá a programar mensajes hoy.",
      subtexto: "Sin instalaciones complicadas. Escaneás el QR, importás tus contactos y listo.",
      feature: "Así de simple",
    }},
    { template: "dolor", filename: "03-dolor-cumpleanos", data: {
      titulo: "Tengo 300 clientes y no me acuerdo del cumpleaños de ninguno.",
      subtexto: "Y cuando te acordás, ya pasó. El cliente no dice nada, pero lo nota.",
    }},
    { template: "educacion", filename: "04-educacion-5-fechas", data: {
      titulo: "5 fechas que tu inmobiliaria no puede dejar pasar.",
      subtexto: "Vencimientos de alquiler, renovaciones, cumpleaños, aniversarios de operación y fechas especiales del rubro.",
      pieFrase: "@OnMindApp",
    }},
    { template: "dolor", filename: "05-dolor-cerro-con-otro", data: {
      titulo: 'El cliente cerró con otra inmobiliaria. "No sabía que seguías trabajando", me dijo.',
      subtexto: "Si no le escribís, para tu cliente no existís. Así de simple.",
    }},
    { template: "educacion", filename: "06-educacion-seguimiento", data: {
      titulo: "El seguimiento no es insistir. Es estar presente.",
      subtexto: 'Un mensaje oportuno dice "me importás". Un mensaje fuera de tiempo dice "te quiero vender algo".',
      pieFrase: "@OnMindApp",
    }},
    { template: "dolor", filename: "07-dolor-vencimiento", data: {
      titulo: "Se me venció el alquiler de un cliente y me enteré por él.",
      subtexto: "Cuando te acordás tarde, el cliente ya lo resolvió con otro. OnMind te avisa antes.",
    }},
    { template: "producto", filename: "08-producto-cumpleanos", data: {
      titulo: "Cargás la fecha de cumpleaños y OnMind se encarga del resto.",
      subtexto: "Cuando importás o editás un contacto con fecha de cumpleaños, el mensaje se programa solo. Sin tocar nada más.",
      feature: "Cumpleaños",
    }},
    { template: "educacion", filename: "09-educacion-vinculo", data: {
      titulo: "Tu cliente no se fue por el precio. Se fue porque se olvidó de vos.",
      subtexto: "El vínculo se mantiene con presencia, no con descuentos.",
      pieFrase: "@OnMindApp",
    }},
  ];

  for (const { template, filename, data } of batch) {
    await renderPost(template, data, filename);
  }
  console.log(`\n${batch.length} posts generados en output/pendientes/`);
} else if (args.length >= 2) {
  // Uso: node generate-post.mjs <template> <filename> < datos.json
  const [template, filename] = args;
  const input = readFileSync("/dev/stdin", "utf-8");
  const data = JSON.parse(input);
  await renderPost(template, data, filename);
} else {
  console.log(`
Uso:
  node scripts/generate-post.mjs --test
  echo '{"titulo":"...","subtexto":"..."}' | node scripts/generate-post.mjs <template> <filename>

Templates: ${Object.keys(TEMPLATES).join(", ")}
  `);
}
