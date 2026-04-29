import type { ReactNode } from "react";
import {
  ConcentricCircles,
  ContactsCoolingTimeline,
  ModelFlow,
  EssentialConfig,
  ContactCard,
  TwoTypesOfDates,
  DashboardMockup,
  QuickFeatureList,
  YesNoColumns,
  ClosingMark,
} from "@/components/slide-visuals";

export type Slide = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  visual: ReactNode;
};

export const demoSlides: Slide[] = [
  {
    id: "intro",
    eyebrow: "OnMind",
    title: (
      <>
        Que tus clientes <span className="text-primary">piensen en vos</span>{" "}
        cuando te necesiten.
      </>
    ),
    body: (
      <p className="text-xl text-muted-foreground leading-relaxed">
        Mantenemos vivo el vínculo con tu cartera por WhatsApp, sin que tengas
        que escribir cientos de mensajes a mano. En 20 minutos te muestro cómo.
      </p>
    ),
    visual: <ConcentricCircles />,
  },
  {
    id: "problema",
    eyebrow: "El problema",
    title: <>Tu cartera se enfría sin que te des cuenta.</>,
    body: (
      <ul className="space-y-3 text-lg text-muted-foreground">
        <li className="flex gap-3">
          <span className="text-primary font-semibold">→</span>
          <span>Sabés que tendrías que escribirles a todos. No te da el tiempo.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary font-semibold">→</span>
          <span>Los contactos se enfrían. Se olvidan.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary font-semibold">→</span>
          <span>
            Cuando necesitan comprar, vender o alquilar, llaman al que tienen
            <strong className="text-foreground"> más presente</strong> — no
            necesariamente al mejor.
          </span>
        </li>
      </ul>
    ),
    visual: <ContactsCoolingTimeline />,
  },
  {
    id: "modelo",
    eyebrow: "Cómo funciona",
    title: <>El modelo en 4 piezas.</>,
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          Configurás las primeras tres una vez. La cuarta se genera sola, para
          todo el año.
        </p>
        <ul className="space-y-2.5">
          <li>
            <strong className="text-foreground">Contactos.</strong> Tu cartera
            ordenada.
          </li>
          <li>
            <strong className="text-foreground">Categorías.</strong> Cuántos
            mensajes al año recibe cada uno.
          </li>
          <li>
            <strong className="text-foreground">Plantillas.</strong> Qué les
            vas a decir.
          </li>
          <li>
            <strong className="text-foreground">Calendario anual.</strong>{" "}
            OnMind genera y distribuye todos los mensajes.
          </li>
        </ul>
      </div>
    ),
    visual: <ModelFlow />,
  },
  {
    id: "configuracion",
    eyebrow: "Demo · arranque",
    title: <>Las 3 cosas que hay que dejar listas.</>,
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          Antes de generar nada, hay un trabajo previo que se hace una vez —
          y define cómo se va a sentir todo el año.
        </p>
        <ul className="space-y-2 text-base">
          <li>
            <strong className="text-foreground">Categorías:</strong> niveles de
            relación con su frecuencia anual.
          </li>
          <li>
            <strong className="text-foreground">Plantillas:</strong> los textos
            con variables, imagen, audio.
          </li>
          <li>
            <strong className="text-foreground">CSV de contactos:</strong>{" "}
            cartera prolija con la columna de categoría.
          </li>
        </ul>
      </div>
    ),
    visual: <EssentialConfig />,
  },
  {
    id: "contactos",
    eyebrow: "Demo · contactos",
    title: <>La ficha del contacto.</>,
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          Cada contacto es una mini-CRM: datos básicos, datos personales,
          origen, etiquetas, redes, notas.
        </p>
        <p className="text-base">
          La <strong className="text-foreground">categoría</strong> y las{" "}
          <strong className="text-foreground">etiquetas</strong> son la
          inteligencia de tu cartera — definen qué mensajes recibe y cómo
          podés filtrarlo después.
        </p>
      </div>
    ),
    visual: <ContactCard />,
  },
  {
    id: "fechas",
    eyebrow: "Demo · fechas",
    title: <>Dos tipos de fechas que no se te escapan.</>,
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          <strong className="text-foreground">Del contacto:</strong> cumpleaños
          y celebraciones globales (Día del Padre, Madre, Niño, Abuelo) —
          solo a quien corresponde.
        </p>
        <p>
          <strong className="text-foreground">De cierre:</strong> el corazón
          del seguimiento inmobiliario. Vencimientos de alquiler, aniversarios
          de venta, recordatorios antes y después.
        </p>
      </div>
    ),
    visual: <TwoTypesOfDates />,
  },
  {
    id: "dashboard",
    eyebrow: "Demo · día a día",
    title: (
      <>
        El dashboard: pendientes, histórico y el botón de{" "}
        <span className="text-primary">procesar</span>.
      </>
    ),
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          De acá vivís el día a día: cuántos mensajes hay para hoy, mañana,
          esta semana; qué pasó con los enviados, qué fallaron, qué se omitieron.
        </p>
        <p className="text-base">
          <strong className="text-foreground">
            Los mensajes no se disparan solos.
          </strong>{" "}
          Cada mañana revisás los pendientes y le das a{" "}
          <strong className="text-foreground">&ldquo;Procesar mensajes para hoy&rdquo;</strong>.
          Salen uno a uno, con 5 a 9 min entre cada uno: cuida tu número y le
          da tiempo a tu equipo a responder.
        </p>
      </div>
    ),
    visual: <DashboardMockup />,
  },
  {
    id: "recorrido",
    eyebrow: "Demo · recorrido rápido",
    title: <>Lo demás, en pocos minutos.</>,
    body: (
      <p className="text-lg text-muted-foreground leading-relaxed">
        El resto del producto está pensado para que el día a día funcione
        sin fricción. Lo recorremos rápido.
      </p>
    ),
    visual: <QuickFeatureList />,
  },
  {
    id: "alcance",
    eyebrow: "Para qué sí, para qué no",
    title: <>Qué resuelve OnMind, y qué no.</>,
    body: (
      <p className="text-lg text-muted-foreground leading-relaxed">
        Para evitar confusiones: OnMind mantiene vivo el vínculo con la cartera
        que ya tenés. No reemplaza tu WhatsApp, no responde leads nuevos por vos
        y no es spam.
      </p>
    ),
    visual: <YesNoColumns />,
  },
  {
    id: "cierre",
    eyebrow: "Próximos pasos",
    title: <>Coordinemos el onboarding.</>,
    body: (
      <div className="space-y-4 text-lg text-muted-foreground">
        <p>
          El equipo de OnMind te acompaña a definir categorías, armar las
          plantillas iniciales y dejar tu CSV listo para importar.
        </p>
        <p className="text-base">
          <strong className="text-foreground">onmindcrm.com</strong>
        </p>
      </div>
    ),
    visual: <ClosingMark />,
  },
];
