import type { ReactNode } from "react"
import Link from "next/link"
import {
  Users,
  GitBranch,
  UserPlus,
  CalendarClock,
  LinkIcon,
  MessageSquareText,
  Clock,
  Mail,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HashScroll } from "./hash-scroll"

interface DocSection {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href?: string
  faqs: { question: string; answer: ReactNode }[]
  tips?: ReactNode[]
}

const SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Cómo funciona el CRM",
    description:
      "Esta sección centraliza el seguimiento de los leads que llegan por la landing, Instagram o referidos. La idea es que ninguno se pierda y que entre Raphael y Martín tengamos siempre claro en qué estado está cada uno.",
    icon: Users,
    faqs: [
      {
        question: "¿Cuál es el flujo en una mirada?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>Llega un lead (manual o automático desde la landing).</li>
            <li>Se asigna a Raphael o Martín por turnos (round-robin).</li>
            <li>El owner contacta al lead y le manda un link para agendar la demo.</li>
            <li>El lead elige día y hora desde un link público.</li>
            <li>Hacemos la demo y mandamos propuesta.</li>
            <li>Si arranca, queda como cliente. Si se enfría, el sistema avisa para retomarlo.</li>
          </ul>
        ),
      },
      {
        question: "¿Quién ve qué leads?",
        answer:
          "Ambos vemos todos los leads, sin importar a quién esté asignado. Cada uno tiene su \"owner\" para saber a quién le toca, pero la visibilidad es compartida. Cualquiera puede tomar un lead que originalmente estaba asignado al otro (por ejemplo, si uno está ocupado).",
      },
      {
        question: "¿Dónde empiezo?",
        answer: (
          <>
            <p className="mb-2">Tres pasos antes de usar el CRM por primera vez:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                <Link href="/dashboard/disponibilidad" className="text-primary underline cursor-pointer">
                  Configurá tu disponibilidad
                </Link>{" "}
                semanal (días y horarios en los que tomás demos).
              </li>
              <li>
                <Link href="/dashboard/configuracion" className="text-primary underline cursor-pointer">
                  Revisá tus plantillas de mensaje
                </Link>{" "}
                (los textos que mandás a los leads). Vienen con defaults razonables, podés editarlos.
              </li>
              <li>Cuando llegue el primer lead, abrilo desde Pipeline y seguí los pasos del detail.</li>
            </ol>
          </>
        ),
      },
    ],
  },
  {
    id: "pipeline",
    title: "Pipeline de estados",
    description:
      "El kanban tiene 6 columnas activas + una banda de 'Perdido' al final. Cada lead se mueve manualmente arrastrando la card o desde el dropdown del detail. Algunos cambios pasan automáticamente.",
    icon: GitBranch,
    href: "/dashboard/leads",
    faqs: [
      {
        question: "¿Qué significa cada estado?",
        answer: (
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Nuevo:</strong> recién llegó, todavía no le escribimos.</li>
            <li><strong>Contactado:</strong> ya le mandamos el primer mensaje (típicamente con el link de booking) y estamos esperando que reserve.</li>
            <li><strong>Demo agendada:</strong> el lead reservó un slot. Pasa solo cuando reserva el link público.</li>
            <li><strong>Demo realizada:</strong> ya hicimos la demo. Lo movés a mano cuando termina la videollamada.</li>
            <li><strong>En evaluación:</strong> el lead pagó el primer mes y está en los 15 días con devolución del dinero. La fecha de inicio del trial se setea automáticamente cuando entrás a este estado por primera vez.</li>
            <li><strong>Cliente:</strong> arrancó la suscripción.</li>
            <li><strong>Perdido:</strong> no avanzó. Estado terminal.</li>
          </ul>
        ),
      },
      {
        question: "¿Qué cambios pasan solos?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>Cuando el lead reserva un slot → pasa a <strong>Demo agendada</strong>.</li>
            <li>Cuando entra a <strong>En evaluación</strong> → se guarda la fecha de inicio del trial (no se resetea si vuelve atrás y avanza de nuevo).</li>
            <li>El resto se mueve a mano.</li>
          </ul>
        ),
      },
      {
        question: "¿Qué hacen las dos vistas (Kanban / Lista)?",
        answer:
          "Kanban es para ver el pipeline en columnas y mover leads arrastrándolos. Lista es para ver todo en tabla con filtros por estado, útil cuando hay muchos leads y querés buscar uno específico. Cuando entrás a un lead y volvés con 'Volver a leads', el sistema te lleva a la vista en la que estabas.",
      },
      {
        question: "¿Qué muestran las card del kanban?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>Nombre del lead.</li>
            <li>Origen (Web, Instagram, Referido).</li>
            <li>Iniciales del owner asignado (R o M) abajo a la derecha.</li>
            <li>Cuando está en evaluación: días restantes del trial en ámbar.</li>
            <li>Punto ámbar arriba a la derecha: el lead necesita seguimiento (ver sección).</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "ingreso",
    title: "Cómo entran los leads",
    description:
      "Hay dos caminos: automático desde el formulario de demo de la landing, o manual desde el dashboard.",
    icon: UserPlus,
    href: "/dashboard/leads/nuevo",
    faqs: [
      {
        question: "¿Cómo se asigna el owner al ingresar?",
        answer:
          "Por turnos estrictos: lead 1 va para Raphael, lead 2 para Martín, lead 3 para Raphael, y así. La asignación se puede cambiar a mano desde el dropdown 'Owner' del detail del lead, sin restricciones.",
      },
      {
        question: "¿Qué pasa cuando llega un lead automático?",
        answer: (
          <>
            <p className="mb-2">Cuando alguien envía el formulario de demo en la landing de OnMind:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Se crea el lead con estado <strong>Nuevo</strong> y owner asignado por turno.</li>
              <li>Llega un email a Raphael y Martín con los datos del lead y a quién le tocó.</li>
              <li>Si el lead ya existía con ese email, no se duplica — se registra una nota interna y listo.</li>
            </ul>
          </>
        ),
      },
      {
        question: "¿Cómo cargo un lead a mano?",
        answer: (
          <>
            En el sidebar, <strong>Leads → Nuevo lead</strong>. Llenás nombre, email, WhatsApp opcional, origen y rubro. Después podés mover el estado y agregar notas desde el detail.
          </>
        ),
      },
    ],
    tips: [
      "Si el lead llega por WhatsApp directo o por referido, cargalo a mano. Si llega por la landing, ya entra solo.",
      "Sumá siempre el código de país en el WhatsApp (ej. +598 99...). Sin eso no se puede armar el link de WhatsApp Web automáticamente.",
    ],
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad para demos",
    description:
      "Cada uno configura su propia agenda. Esto es lo que va a ver el lead cuando le mandes el link para agendar.",
    icon: CalendarClock,
    href: "/dashboard/disponibilidad",
    faqs: [
      {
        question: "¿Cómo funciona la plantilla semanal?",
        answer:
          "Cargás bloques recurrentes por día de la semana, por ejemplo 'martes 10:00 a 12:00'. El sistema lo proyecta automáticamente todas las semanas hacia adelante. Los slots se generan cada 30 minutos dentro del rango.",
      },
      {
        question: "¿Qué pasa si tengo una reunión que choca con mi plantilla?",
        answer:
          "Usá los 'Bloqueos puntuales'. Elegís fecha, hora desde / hasta, y opcionalmente un motivo. Ese rango deja de estar disponible para el lead.",
      },
      {
        question: "¿Qué horario ve el lead?",
        answer:
          "El lead ve los slots libres de tu plantilla menos los bloqueos puntuales menos las demos ya reservadas. Si reservó otro lead un slot, ya no aparece para los demás.",
      },
      {
        question: "¿Puedo generar un link de booking sin disponibilidad cargada?",
        answer:
          "No. El botón 'Generar link' queda deshabilitado y el sistema muestra un aviso amarillo pidiéndote que cargues la disponibilidad primero. Esto evita mandar links inutilizables.",
      },
    ],
    tips: [
      "Las horas son siempre en hora de Uruguay (Montevideo).",
      "Cargá tu plantilla con varios días para que el lead tenga opciones — un solo bloque a la semana puede no calzar con la agenda del lead.",
    ],
  },
  {
    id: "booking",
    title: "Link de booking y demo agendada",
    description:
      "El flujo desde que decidís contactar al lead hasta que se agenda la demo y la hacemos.",
    icon: LinkIcon,
    faqs: [
      {
        question: "¿Cómo le mando el link al lead?",
        answer: (
          <>
            <p className="mb-2">Desde el detail del lead:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Apretás <strong>Generar link</strong>. Se crea un link único atado al lead y se copia al clipboard.</li>
              <li>En la sección 'Acciones' apretás <strong>Copiar email</strong> o <strong>Copiar WhatsApp</strong> — el mensaje sale interpolado con el nombre del lead y el link.</li>
              <li>Pegás donde quieras enviarlo. Para WhatsApp además podés abrir directamente WhatsApp Web con el mensaje pre-llenado desde el toast.</li>
              <li>Cambiás manualmente el estado del lead a <strong>Contactado</strong>.</li>
            </ol>
          </>
        ),
      },
      {
        question: "¿Qué ve el lead cuando abre el link?",
        answer:
          "Una página simple con el logo de OnMind, un saludo personalizado, y el calendario de los próximos 14 días con los slots disponibles del owner. Elige una hora, confirma, y listo.",
      },
      {
        question: "¿Qué pasa cuando el lead reserva?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>El lead recibe un email confirmando la fecha (sin link de Meet aún).</li>
            <li>El owner recibe un email con el detalle.</li>
            <li>El estado del lead pasa automáticamente a <strong>Demo agendada</strong>.</li>
            <li>En el detail del lead aparece una tarjeta verde con la fecha y un botón para crear el evento en Google Calendar.</li>
          </ul>
        ),
      },
      {
        question: "¿Cómo armo el evento de Google Calendar y el link de Meet?",
        answer: (
          <ol className="list-decimal pl-4 space-y-1">
            <li>En el detail, apretás <strong>Crear evento en Google Calendar</strong>. Abre Calendar en una pestaña nueva con la fecha, el título y el lead como invitado, todo pre-llenado.</li>
            <li>En el evento de Calendar, agregás la videollamada de Meet con el botón "Agregar videollamada de Google Meet".</li>
            <li>Guardás el evento. Google le envía la invitación con el link de Meet al lead automáticamente.</li>
          </ol>
        ),
      },
      {
        question: "Después de la demo, ¿qué hago?",
        answer:
          "Movés el lead a 'Demo realizada' (manual). Si arranca con la propuesta, lo movés a 'En evaluación' (esto setea la fecha de inicio del trial). Si pasa el trial y sigue, a 'Cliente'. Si en algún momento se cae el deal, a 'Perdido'.",
      },
    ],
    tips: [
      "El link de booking siempre apunta al owner del lead. Si cambiás el owner, el link sigue siendo el mismo (no se regenera) — pero los slots disponibles van a ser los del nuevo owner.",
      "Si tenés que reagendar una demo ya confirmada, escribile al lead por afuera y movelo a mano.",
    ],
  },
  {
    id: "mensajes",
    title: "Plantillas de mensaje",
    description:
      "Cada uno tiene su propio set de plantillas para mandar al lead. La app no envía nada automático al lead — siempre copiás el texto y lo mandás vos.",
    icon: MessageSquareText,
    href: "/dashboard/configuracion",
    faqs: [
      {
        question: "¿Qué plantillas hay?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Booking:</strong> el mensaje con el link para agendar.</li>
            <li><strong>Sin respuesta:</strong> recordatorio cuando el lead recibió el primer mensaje y no contestó.</li>
            <li><strong>Post demo:</strong> seguimiento cuando ya hicimos la demo y no avanza.</li>
            <li><strong>Check-in:</strong> mensaje amistoso a mitad del primer mes como cliente para preguntar cómo va.</li>
          </ul>
        ),
      },
      {
        question: "¿Cuándo aparecen los botones de copiar?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>Estado <strong>Nuevo</strong> o <strong>Contactado</strong>: el de booking.</li>
            <li>Estado <strong>Contactado</strong>: además, el de follow-up sin respuesta.</li>
            <li>Estado <strong>Demo realizada</strong>: el de follow-up post demo.</li>
            <li>Estado <strong>Cliente</strong>: el de check-in mes 1.</li>
          </ul>
        ),
      },
      {
        question: "¿Qué variables puedo usar?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li><code>{"{nombre}"}</code> en cualquier plantilla.</li>
            <li><code>{"{linkBooking}"}</code> en la de booking y follow-up sin respuesta. Es el link único del lead para agendar.</li>
            <li><code>{"{linkBrochure}"}</code> en cualquiera. Es la URL pública del brochure de OnMind.</li>
          </ul>
        ),
      },
      {
        question: "¿Las plantillas son compartidas?",
        answer:
          "No. Cada uno tiene las suyas. Cuando entrás al detail de un lead y copiás un mensaje, sale tu propia plantilla, aunque el owner del lead sea el otro.",
      },
    ],
    tips: [
      "Mantené los textos cortos y naturales. Editá los defaults para que suenen como vos.",
      "Si no te conformás con un cambio, podés volver al default con el botón 'Restaurar default'.",
    ],
  },
  {
    id: "seguimiento",
    title: "Seguimiento automático",
    description:
      "Cuando un lead se queda quieto en un estado, el sistema te avisa para retomarlo. La idea es no perder leads tibios.",
    icon: Clock,
    href: "/dashboard/leads/seguimiento",
    faqs: [
      {
        question: "¿Cuándo se dispara un follow-up?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Contactado</strong> sin movimiento por <strong>3 días</strong>.</li>
            <li><strong>Demo realizada</strong> sin avanzar por <strong>5 días</strong>.</li>
            <li><strong>Cliente</strong> activo por <strong>15 días</strong> (check-in amistoso a mitad del primer mes).</li>
          </ul>
        ),
      },
      {
        question: "¿Cómo me entero?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>Email puntual al owner cuando un lead entra a 'Necesita seguimiento'. Solo cuando entra, no todos los días.</li>
            <li>Badge ámbar en el sidebar (en 'Seguimiento') con el número de pendientes tuyos.</li>
            <li>Punto ámbar en la card del kanban del lead.</li>
            <li>Banda ámbar arriba del detail del lead con el botón 'Marcar como hecho'.</li>
          </ul>
        ),
      },
      {
        question: "¿Cómo lo gestiono?",
        answer: (
          <>
            <p className="mb-2">En el panel <strong>Seguimiento</strong> tenés todos los pendientes. Por cada uno:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Abrir</strong>: te lleva al detail para escribirle al lead con la plantilla correspondiente.</li>
              <li><strong>Hecho</strong>: lo marcás como atendido (cuando ya le escribiste y estás esperando respuesta).</li>
              <li><strong>X (Descartar)</strong>: lo sacás del panel sin haber contactado al lead.</li>
            </ul>
          </>
        ),
      },
      {
        question: "¿Y si muevo el estado del lead?",
        answer:
          "Cualquier cambio de estado (manual o automático por reserva) resuelve los follow-ups activos del lead. Por ejemplo, si pasa de 'Contactado' a 'Demo agendada', el follow-up desaparece solo del panel.",
      },
      {
        question: "¿Cuándo NO molesta el sistema?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li>En estado <strong>En evaluación</strong> (los 15 días del trial pago) no hay follow-up automático — el cliente ya pagó, no queremos hostigar.</li>
            <li>En <strong>Demo agendada</strong> tampoco: el lead ya está comprometido con una fecha.</li>
            <li>En <strong>Perdido</strong> obvio que no.</li>
          </ul>
        ),
      },
    ],
    tips: [
      "El follow-up se calcula sobre la última actualización del lead. Si agregaste una nota o cambiaste el owner, se reinicia el contador.",
      "El cron corre una vez por día a las 09:00 hora UY.",
    ],
  },
  {
    id: "emails",
    title: "Notificaciones por email",
    description:
      "Lista completa de los emails que dispara el sistema, para que sepas qué esperar.",
    icon: Mail,
    faqs: [
      {
        question: "¿Qué emails recibo yo (como socio)?",
        answer: (
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Lead nuevo</strong>: cuando llega un lead manual o por la landing. Lo recibimos los dos.</li>
            <li><strong>Cambio de estado</strong>: cuando el otro socio mueve un lead. Solo lo recibe el que NO movió.</li>
            <li><strong>Lead reservó la demo</strong>: solo lo recibe el owner del lead.</li>
            <li><strong>Lead necesita seguimiento</strong>: cuando un lead asignado a mí se queda quieto X días. Solo lo recibe el owner.</li>
          </ul>
        ),
      },
      {
        question: "¿Qué emails recibe el lead?",
        answer:
          "Solo uno disparado por la app: confirmación de la demo agendada cuando reserva el slot. Sin link de Meet — eso lo manda Google Calendar después de que armás el evento.",
      },
      {
        question: "¿Y el resto de los mensajes al lead?",
        answer:
          "Todo lo demás (link de booking, follow-ups, check-in, recordatorios) lo mandamos nosotros manualmente desde nuestro email o WhatsApp personal. La app solo prepara el texto y lo copia al clipboard.",
      },
    ],
  },
]

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-4xl w-full">
      <HashScroll />
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cómo funciona el CRM</h1>
        <p className="text-muted-foreground">
          Guía de uso del CRM de leads. Está pensado para que entre Raphael y
          Martín tengamos siempre claro qué hacer en cada paso.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <Card key={section.id} id={section.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  {section.href && (
                    <CardDescription className="mt-1">
                      <Link
                        href={section.href}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        Ir a {section.title}
                      </Link>
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.description}
              </p>

              <Accordion type="multiple" className="w-full">
                {section.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${section.id}-${index}`}
                  >
                    <AccordionTrigger className="text-left text-sm cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {section.tips && section.tips.length > 0 && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1">
                      {section.tips.map((tip, index) => (
                        <li key={index} className="text-sm">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
