import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import { BRAND } from "../lib/colors"

// Tutorial Contactos — versión 9:16 (Reel/Stories)
// Master 1080x1920. 72s totales. Mismo audio y guion que tutorial-contactos,
// layout reorganizado vertical: pasos apilados, ficha en una columna, cards en stack.

const AUDIO_SRC = staticFile("tutorials/2026-05-12-contactos/voz.mp3")

// ---------- Helpers ----------

function useFadeSlide(start: number, dur = 20, slideFrom = 30) {
  const f = useCurrentFrame()
  const localFrame = f - start
  const opacity = interpolate(localFrame, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const translateY = interpolate(localFrame, [0, dur], [slideFrom, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return { opacity, transform: `translateY(${translateY}px)` }
}

function CheckIcon({ size = 24, color = BRAND.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L19 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------- Escena 1: Title ----------

function Scene1Title() {
  const titleStyle = useFadeSlide(0, 18, 40)
  const subStyle = useFadeSlide(10, 18, 40)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 22,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 170,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
        }}
      >
        Contactos
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 46,
          color: BRAND.muted,
        }}
      >
        Tu base, viva.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: CSV (vertical: icon arriba, steps abajo) ----------

function CsvIcon({ opacity, transform }: { opacity: number; transform: string }) {
  return (
    <div
      style={{
        opacity,
        transform,
        background: "white",
        borderRadius: 18,
        padding: 28,
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: 720,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 60,
            height: 70,
            background: BRAND.mint,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: BRAND.teal,
            fontWeight: 700,
          }}
        >
          CSV
        </div>
        <div style={{ color: BRAND.body, fontFamily: "system-ui", fontSize: 28, fontWeight: 600 }}>
          contactos.csv
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["María Rodríguez", "099123456"],
          ["Carlos González", "098234567"],
          ["Sofía Acosta", "097345678"],
          ["Andrés Pereira", "096456789"],
        ].map(([name, phone], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 16px",
              background: i % 2 === 0 ? BRAND.bg : "white",
              borderRadius: 4,
              fontSize: 22,
              color: BRAND.body,
            }}
          >
            <span>{name}</span>
            <span style={{ color: BRAND.muted, fontVariantNumeric: "tabular-nums" }}>
              {phone}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Step({
  index,
  label,
  start,
  done,
}: {
  index: number
  label: string
  start: number
  done: number
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 18], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const checkOp = interpolate(f, [done, done + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 22px",
        background: "white",
        border: `1px solid ${BRAND.hairline}`,
        borderRadius: 14,
        width: 720,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          background: checkOp > 0.5 ? BRAND.teal : BRAND.mint,
          color: checkOp > 0.5 ? "white" : BRAND.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {checkOp > 0.5 ? <CheckIcon size={24} color="white" /> : index}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: BRAND.ink,
          flex: 1,
        }}
      >
        {label}
      </div>
    </div>
  )
}

function Scene2Csv() {
  const f = useCurrentFrame()

  const csvOp = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const csvSlide = interpolate(f, [0, 22], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const updateNoteOp = interpolate(f, [320, 345], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const updateNoteSlide = interpolate(f, [320, 350], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <CsvIcon opacity={csvOp} transform={`translateY(${csvSlide}px)`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Step index={1} label="Subir el archivo" start={50} done={95} />
        <Step index={2} label="Mapear columnas" start={105} done={155} />
        <Step index={3} label="Previsualizar" start={165} done={215} />
        <Step index={4} label="Confirmar" start={225} done={275} />
      </div>
      <div
        style={{
          opacity: updateNoteOp,
          transform: `translateY(${updateNoteSlide}px)`,
          padding: "16px 26px",
          background: BRAND.mint,
          borderRadius: 12,
          color: BRAND.teal,
          fontSize: 26,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <CheckIcon size={28} color={BRAND.teal} />
        Si el teléfono ya existía, actualiza
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: WhatsApp auto (vertical) ----------

function WhatsAppBubble({ start }: { start: number }) {
  const f = useCurrentFrame()
  const op = interpolate(f, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 22], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        opacity: op,
        transform: `translateY(${slide}px)`,
        background: "#DCF8C6",
        padding: "22px 28px",
        borderRadius: 18,
        borderTopLeftRadius: 4,
        maxWidth: 720,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 28, color: "#1F2937", lineHeight: 1.4 }}>
        Hola, vi tu publicación del apartamento en Pocitos. Sigue disponible?
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#6B7280",
          alignSelf: "flex-end",
          fontWeight: 500,
        }}
      >
        14:32 ✓✓
      </div>
    </div>
  )
}

function ContactCardAuto({ start }: { start: number }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sp = spring({
    frame: f - start,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.7 },
  })
  const opacity = interpolate(f, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const scale = 0.85 + sp * 0.15

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: "white",
        borderRadius: 22,
        padding: 32,
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 24,
        width: 820,
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          background:
            "linear-gradient(135deg, #FCA5A5 0%, #F87171 50%, #DC2626 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 42,
          color: "white",
          flexShrink: 0,
        }}
      >
        LP
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: BRAND.ink }}>
          Lucía Pereira
        </div>
        <div style={{ fontSize: 24, color: BRAND.muted, fontVariantNumeric: "tabular-nums" }}>
          +598 99 876 543
        </div>
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            background: BRAND.mint,
            color: BRAND.teal,
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          WhatsApp · Mensaje entrante
        </div>
      </div>
    </div>
  )
}

function Scene3WhatsApp() {
  const f = useCurrentFrame()
  const arrowOp = interpolate(f, [110, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const tagPulse = interpolate(
    f,
    [240, 255, 270, 285, 300],
    [0, 0.7, 0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const noteOp = interpolate(f, [305, 330], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const noteSlide = interpolate(f, [305, 335], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 36,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <WhatsAppBubble start={0} />
      <div
        style={{
          opacity: arrowOp,
          fontSize: 100,
          color: BRAND.teal,
          fontWeight: 300,
          lineHeight: 1,
        }}
      >
        ↓
      </div>
      <div style={{ position: "relative" }}>
        <ContactCardAuto start={160} />
        <div
          style={{
            position: "absolute",
            left: 162,
            bottom: 28,
            border: `4px solid ${BRAND.teal}`,
            borderRadius: 999,
            width: 320,
            height: 50,
            opacity: tagPulse,
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          opacity: noteOp,
          transform: `translateY(${noteSlide}px)`,
          fontSize: 30,
          color: BRAND.muted,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        Sin formularios. Sin cargas manuales.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Ficha rica (1 columna en vertical) ----------

function FieldRow({
  label,
  value,
  highlight,
  highlightStart,
}: {
  label: string
  value: string
  highlight: boolean
  highlightStart: number
}) {
  const f = useCurrentFrame()
  const ringOp = interpolate(
    f,
    [highlightStart, highlightStart + 12, highlightStart + 30, highlightStart + 42],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: `1px solid ${BRAND.hairline}`,
        position: "relative",
      }}
    >
      <span style={{ fontSize: 26, color: BRAND.muted, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 28, color: BRAND.ink, fontWeight: 600 }}>{value}</span>
      {highlight && (
        <div
          style={{
            position: "absolute",
            inset: "0 -12px 4px",
            border: `3px solid ${BRAND.teal}`,
            borderRadius: 10,
            opacity: ringOp,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  )
}

function Scene4Ficha() {
  const f = useCurrentFrame()
  const cardOp = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const cardSlide = interpolate(f, [0, 22], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: cardOp,
          transform: `translateY(${cardSlide}px)`,
          background: "white",
          borderRadius: 24,
          padding: 44,
          width: 920,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 26px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              background: BRAND.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 36,
              color: BRAND.teal,
            }}
          >
            CG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.ink }}>
              Carlos González
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span
                style={{
                  background: BRAND.mint,
                  color: BRAND.teal,
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Comprador
              </span>
              <span
                style={{
                  background: "#FEF3C7",
                  color: "#854D0E",
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                VIP
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: BRAND.hairline, opacity: 0.5 }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <FieldRow
            label="Cumpleaños"
            value="14 de marzo"
            highlight
            highlightStart={50}
          />
          <FieldRow
            label="Es padre/madre"
            value="Sí (2 hijos)"
            highlight
            highlightStart={105}
          />
          <FieldRow
            label="Hobbies"
            value="ciclismo, pesca"
            highlight
            highlightStart={160}
          />
          <FieldRow
            label="Profesión"
            value="Contador"
            highlight
            highlightStart={215}
          />
          <FieldRow
            label="Dónde lo conociste"
            value="Open House Pocitos"
            highlight
            highlightStart={270}
          />
          <FieldRow
            label="Motivo del primer contacto"
            value="Compra apto Pocitos"
            highlight
            highlightStart={325}
          />
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Filtros (vertical: chips wrap + URL) ----------

function FilterChip({
  label,
  start,
}: {
  label: string
  start: number
}) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sp = spring({
    frame: f - start,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.6 },
  })
  const opacity = interpolate(f, [start, start + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const scale = 0.6 + sp * 0.4

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: BRAND.mint,
        color: BRAND.teal,
        padding: "16px 26px",
        borderRadius: 999,
        fontSize: 30,
        fontWeight: 600,
        border: `2px solid ${BRAND.teal}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  )
}

function Scene5Filtros() {
  const f = useCurrentFrame()
  const headerOp = interpolate(f, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const urlOp = interpolate(f, [240, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const urlSlide = interpolate(f, [240, 275], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: headerOp,
          fontSize: 38,
          fontWeight: 600,
          color: BRAND.muted,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Filtros
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: 960,
          padding: "0 40px",
        }}
      >
        <FilterChip label="Categoría" start={20} />
        <FilterChip label="Etiquetas" start={50} />
        <FilterChip label="Operación" start={80} />
        <FilterChip label="Profesión" start={110} />
        <FilterChip label="Origen" start={140} />
        <FilterChip label="Fechas especiales" start={170} />
      </div>

      <div
        style={{
          opacity: urlOp,
          transform: `translateY(${urlSlide}px)`,
          marginTop: 24,
          background: "white",
          border: `1px solid ${BRAND.hairline}`,
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 24,
          color: BRAND.body,
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          maxWidth: 920,
          textAlign: "center",
        }}
      >
        <span style={{ color: BRAND.teal, fontWeight: 700 }}>onmindcrm.com</span>
        <span style={{ color: BRAND.muted }}>
          /contactos?categoria=comprador&amp;mes=marzo
        </span>
      </div>
      <div
        style={{
          opacity: urlOp,
          fontSize: 26,
          color: BRAND.muted,
          fontWeight: 500,
          marginTop: -16,
        }}
      >
        Guardala. Compartila con tu equipo.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Resultado (cards apiladas) ----------

type AudienceData = {
  filterLabel: string
  count: number
  description: string
}

function AudienceCard({
  data,
  start,
}: {
  data: AudienceData
  start: number
}) {
  const f = useCurrentFrame()
  const localFrame = f - start
  const opacity = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(localFrame, [0, 22], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const counted = Math.round(
    interpolate(localFrame, [16, 50], [0, data.count], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px)`,
        background: "white",
        borderRadius: 22,
        padding: "32px 44px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: 860,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          background: BRAND.mint,
          color: BRAND.teal,
          padding: "10px 22px",
          borderRadius: 999,
          fontSize: 26,
          fontWeight: 600,
        }}
      >
        {data.filterLabel}
      </div>
      <div
        style={{
          fontSize: 160,
          fontWeight: 700,
          color: BRAND.ink,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.03em",
        }}
      >
        {counted}
      </div>
      <div
        style={{
          fontSize: 30,
          color: BRAND.muted,
          fontWeight: 500,
        }}
      >
        {data.description}
      </div>
    </div>
  )
}

function Scene6Resultado() {
  const f = useCurrentFrame()
  const noteOp = interpolate(f, [220, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const noteSlide = interpolate(f, [220, 255], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <AudienceCard
        data={{
          filterLabel: "Día del Padre",
          count: 38,
          description: "padres listos para saludar",
        }}
        start={20}
      />
      <AudienceCard
        data={{
          filterLabel: "Aniversario de compra",
          count: 12,
          description: "cerraron este mes",
        }}
        start={130}
      />
      <div
        style={{
          opacity: noteOp,
          transform: `translateY(${noteSlide}px)`,
          fontSize: 32,
          color: BRAND.teal,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          marginTop: 8,
        }}
      >
        Cada mensaje, a quien tiene sentido.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 7: Cierre ----------

function Scene7Closing() {
  const f = useCurrentFrame()
  const line1 = useFadeSlide(0, 20, 26)
  const line2Op = interpolate(f, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line2Slide = interpolate(f, [70, 95], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...line1,
          fontSize: 72,
          fontWeight: 600,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Una base que conoce
        <br />
        a tus clientes.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.02em",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Y se acuerda
        <br />
        de cada uno por vos.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Outro ----------

function Outro() {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [0, 22], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 26,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slide}px)`,
          fontSize: 130,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
        }}
      >
        @OnMindApp
      </div>
      <div
        style={{
          opacity,
          width: 160,
          height: 6,
          background: BRAND.teal,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Root ----------

export function TutorialContactos9x16() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Sequence from={0} durationInFrames={75}>
        <Scene1Title />
      </Sequence>
      <Sequence from={75} durationInFrames={405}>
        <Scene2Csv />
      </Sequence>
      <Sequence from={480} durationInFrames={375}>
        <Scene3WhatsApp />
      </Sequence>
      <Sequence from={855} durationInFrames={390}>
        <Scene4Ficha />
      </Sequence>
      <Sequence from={1245} durationInFrames={375}>
        <Scene5Filtros />
      </Sequence>
      <Sequence from={1620} durationInFrames={300}>
        <Scene6Resultado />
      </Sequence>
      <Sequence from={1920} durationInFrames={150}>
        <Scene7Closing />
      </Sequence>
      <Sequence from={2070} durationInFrames={90}>
        <Outro />
      </Sequence>
      <Audio src={AUDIO_SRC} />
    </AbsoluteFill>
  )
}
