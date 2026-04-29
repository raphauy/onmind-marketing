import { OnMindLogo } from "@/components/logo";
import {
  Cake,
  Heart,
  Gift,
  Baby,
  Key,
  Home,
  ShoppingBag,
  FileSignature,
  MessageSquare,
  Users,
  Megaphone,
  Settings,
  Smartphone,
} from "lucide-react";

export function ConcentricCircles() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-full max-w-[420px] flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const size = i * 18;
          return (
            <div
              key={i}
              className="absolute rounded-full border border-primary/20"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                opacity: 1 - i * 0.12,
              }}
            />
          );
        })}
        <div className="relative z-10 h-32 w-32 rounded-full bg-primary/5 flex items-center justify-center">
          <OnMindLogo className="h-12 w-auto text-primary" />
        </div>
      </div>
    </div>
  );
}

export function ContactsCoolingTimeline() {
  const dots = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="flex w-full items-center gap-1.5">
        {dots.map((i) => {
          const opacity = Math.max(0.15, 1 - i * 0.075);
          const size = Math.max(10, 22 - i);
          return (
            <div
              key={i}
              className="rounded-full bg-primary"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                opacity,
              }}
            />
          );
        })}
      </div>
      <div className="flex w-full justify-between text-xs text-muted-foreground/70 uppercase tracking-wider">
        <span>contactaste</span>
        <span>silencio</span>
        <span>se olvidan</span>
      </div>
    </div>
  );
}

export function ModelFlow() {
  const nodes = [
    { label: "Contactos", sub: "tu cartera" },
    { label: "Categorías", sub: "frecuencia anual" },
    { label: "Plantillas", sub: "qué decir" },
    { label: "Calendario", sub: "anual automático" },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-2">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex w-full flex-col items-center">
          <div className="w-full max-w-[260px] rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-3 text-center">
            <div className="text-base font-semibold text-foreground">
              {n.label}
            </div>
            <div className="text-xs text-muted-foreground">{n.sub}</div>
          </div>
          {i < nodes.length - 1 && (
            <div className="my-1 h-5 w-0.5 bg-primary/40" />
          )}
        </div>
      ))}
    </div>
  );
}

export function EssentialConfig() {
  const steps = [
    {
      num: "1",
      title: "Categorías",
      sub: "niveles de relación + frecuencia anual",
    },
    {
      num: "2",
      title: "Plantillas",
      sub: "los mensajes con variedad",
    },
    {
      num: "3",
      title: "CSV de contactos",
      sub: "cartera ordenada y prolija",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-3 justify-center px-2">
      {steps.map((s) => (
        <div key={s.num} className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base">
            {s.num}
          </div>
          <div className="flex-1 pt-1">
            <div className="font-semibold text-foreground text-base">
              {s.title}
            </div>
            <div className="text-sm text-muted-foreground leading-snug">
              {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactCard() {
  return (
    <div className="flex h-full w-full items-center justify-center px-2">
      <div className="w-full max-w-[340px] rounded-xl border-2 border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-primary/5 px-4 py-3 border-b flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            CR
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground text-sm truncate">
              Carolina Rodríguez
            </div>
            <div className="text-xs text-muted-foreground">+598 99 555 234</div>
          </div>
          <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
            A+
          </span>
        </div>
        <div className="p-4 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-medium">caro@mail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cumpleaños</span>
            <span className="text-foreground font-medium">15 de junio</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operación</span>
            <span className="text-foreground font-medium">Compradora</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="rounded-full bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5">
              Pocitos
            </span>
            <span className="rounded-full bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5">
              Inversor
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5">
              Referida
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TwoTypesOfDates() {
  const contact = [
    { Icon: Cake, label: "Cumpleaños" },
    { Icon: Heart, label: "Día de la Madre" },
    { Icon: Gift, label: "Día del Padre" },
    { Icon: Baby, label: "Día del Niño / Abuelo" },
  ];
  const closings = [
    { Icon: Home, label: "Alquiler — propietario" },
    { Icon: Key, label: "Alquiler — inquilino" },
    { Icon: ShoppingBag, label: "Comprador" },
    { Icon: FileSignature, label: "Vendedor" },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-3 justify-center px-2">
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
          Del contacto
        </div>
        <ul className="space-y-1.5">
          {contact.map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-xs text-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
          De cierre
        </div>
        <ul className="space-y-1.5">
          {closings.map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-xs text-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DashboardMockup() {
  const cards = [
    { label: "Hoy", value: "28", primary: true },
    { label: "Mañana", value: "15" },
    { label: "Próx. 7 días", value: "94" },
    { label: "Próx. 30 días", value: "312" },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-3 justify-center px-2">
      <div className="grid grid-cols-2 gap-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-lg border p-3 ${
              c.primary
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {c.label}
            </div>
            <div
              className={`text-2xl font-bold ${
                c.primary ? "text-primary" : "text-foreground"
              }`}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="rounded-lg bg-primary text-primary-foreground font-semibold py-3 px-4 text-sm shadow-md cursor-default"
      >
        Procesar mensajes para hoy (28)
      </button>
      <div className="text-[10px] text-muted-foreground text-center italic">
        envío uno a uno · 5–9 min entre mensajes
      </div>
    </div>
  );
}

export function QuickFeatureList() {
  const items = [
    {
      Icon: MessageSquare,
      title: "Conversaciones",
      sub: "bandeja unificada de WhatsApp",
    },
    {
      Icon: Megaphone,
      title: "Campañas",
      sub: "envíos puntuales segmentados",
    },
    {
      Icon: Users,
      title: "Usuarios y roles",
      sub: "equipo sin límite de dispositivos",
    },
    {
      Icon: Settings,
      title: "Configuración",
      sub: "vacaciones, regenerar, feriados",
    },
    {
      Icon: Smartphone,
      title: "WhatsApp",
      sub: "conexión por QR",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-2 justify-center px-2">
      {items.map(({ Icon, title, sub }) => (
        <div
          key={title}
          className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function YesNoColumns() {
  const yes = [
    "Mantener vivo el vínculo",
    "Recordarte de cumpleaños",
    "Volver en cierres y vencimientos",
    "Distribuir mensajes con criterio",
  ];
  const no = [
    "Responder leads nuevos por vos",
    "Reemplazar tu WhatsApp",
    "Mandar spam masivo",
    "Aprenderse en 3 meses",
  ];
  return (
    <div className="flex h-full w-full flex-col gap-4 px-2 justify-center">
      <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
          ✓ Sí
        </div>
        <ul className="space-y-1.5 text-sm text-foreground">
          {yes.map((y) => (
            <li key={y}>{y}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border-2 border-border bg-muted/40 p-4">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          ✕ No
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {no.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ClosingMark() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="relative aspect-square w-full max-w-[260px] flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-primary/30"
            style={{
              width: `${i * 33}%`,
              height: `${i * 33}%`,
            }}
          />
        ))}
        <OnMindLogo className="h-10 w-auto text-primary relative z-10" />
      </div>
      <div className="text-center text-sm text-muted-foreground uppercase tracking-widest">
        Gracias
      </div>
    </div>
  );
}
