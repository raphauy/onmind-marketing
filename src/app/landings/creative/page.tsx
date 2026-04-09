import { OnMindLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Clock,
  Users,
  CalendarDays,
  MessageSquare,
  FileText,
  Palmtree,
  Shield,
  Timer,
  UserPlus,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

function CirclesMotif({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full border border-l-border pointer-events-none ${className}`} />;
}

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-l-bg text-l-text">
      {/* Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-l-card/85 backdrop-blur-xl border border-l-border rounded-full px-5 py-1.5">
        <a href="#features" className="text-[13px] text-l-muted px-3.5 py-1.5 rounded-full hover:text-l-text hover:bg-teal-10 transition-all">Funciones</a>
        <a href="#como-funciona" className="text-[13px] text-l-muted px-3.5 py-1.5 rounded-full hover:text-l-text hover:bg-teal-10 transition-all">Proceso</a>
        <a href="#historia" className="text-[13px] text-l-muted px-3.5 py-1.5 rounded-full hover:text-l-text hover:bg-teal-10 transition-all">Historia</a>
        <span className="bg-primary/50 text-l-text/60 font-semibold text-[13px] px-5 py-2 rounded-full ml-1 cursor-default">Ingresar</span>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,171,137,.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,171,137,.15)_0%,transparent_70%)] pointer-events-none" />
        <CirclesMotif className="w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        <div className="relative z-10 mb-12 text-primary dark:text-white">
          <OnMindLogo className="h-12" />
        </div>

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em] max-w-[800px] mb-7">
          Que tus clientes<br />
          <span className="bg-gradient-to-r from-primary-light to-primary-glow bg-clip-text text-transparent">piensen en vos</span><br />
          cuando te necesiten
        </h1>

        <p className="relative z-10 text-xl text-l-muted max-w-[500px] mb-11">
          OnMind envía mensajes por WhatsApp por vos, con tu número real, en el momento justo.
        </p>

        <a href="/login" className="relative z-10 inline-flex items-center gap-2.5 bg-primary text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:bg-primary-light hover:shadow-[0_0_40px_rgba(0,171,137,.3)] hover:-translate-y-0.5 transition-all">
          Solicitar demo <ArrowRight className="w-4 h-4" />
        </a>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-l-muted text-[13px] flex flex-col items-center gap-2 animate-bounce">
          <span>Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      {/* Problema */}
      <section className="px-8 py-28">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.15] mb-6">
              El problema no es<br />tu servicio.<br />
              <span className="text-l-faint">Es que tus clientes<br />se olvidan de vos.</span>
            </h2>
          </div>
          <div className="bg-l-card border border-l-border rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-6 bg-l-bg px-3 py-1 rounded-full text-[11px] text-l-muted border border-l-border uppercase tracking-wider font-semibold">WhatsApp</span>
            <div className="text-center text-[11px] text-l-faint mb-4">15 de enero</div>
            <div className="bg-primary rounded-2xl rounded-br-sm p-3 text-sm text-white ml-auto max-w-[85%] mb-2.5">
              Hola María! Vi una propiedad en Pocitos que puede interesarte. ¿Seguís buscando?
            </div>
            <div className="bg-l-subtle rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%] mb-1">
              Sí! Pasame los datos 🙌
            </div>
            <div className="text-right text-[11px] text-l-faint mb-5">Visto ✓✓</div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-l-border" />
              <span className="text-[11px] text-l-micro tracking-widest shrink-0">4 MESES DESPUÉS</span>
              <div className="flex-1 h-px bg-l-border" />
            </div>
            <div className="text-center text-[11px] text-l-faint mb-4">28 de mayo</div>
            <div className="bg-primary rounded-2xl rounded-br-sm p-3 text-sm text-white ml-auto max-w-[85%] mb-2.5">
              María, ¿cómo va la búsqueda? Tengo opciones nuevas que te pueden gustar
            </div>
            <div className="bg-l-subtle rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%]">
              Hola Martín! Al final cerré con otra inmobiliaria el mes pasado. Gracias igual! 😊
            </div>
          </div>
        </div>
      </section>

      {/* Contraste — Con OnMind */}
      <section className="px-8 py-28">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-light uppercase tracking-wider mb-4">Con OnMind</p>
            <h2 className="text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.15] mb-6">
              El mensaje llega<br />en el momento justo.<br />
              <span className="text-l-faint">Y el cliente responde<br />como si fuera magia.</span>
            </h2>
            <p className="text-[15px] text-l-muted leading-relaxed">
              OnMind programa el mensaje por vos. El cliente lo recibe, siente que te acordaste, y responde al toque. Muchos contestan <em>&ldquo;justo estaba por escribirte&rdquo;</em> — no es casualidad, es timing.
            </p>
          </div>
          <div className="bg-l-card border border-l-border rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-6 bg-l-bg px-3 py-1 rounded-full text-[11px] text-l-muted border border-l-border uppercase tracking-wider font-semibold">WhatsApp</span>
            <div className="text-center text-[11px] text-l-faint mb-4">14 de marzo</div>
            <div className="bg-primary rounded-2xl rounded-br-sm p-3 text-sm text-white ml-auto max-w-[85%] mb-1">
              Hola Carlos, ¿cómo andás? Espero que arranques bien el año. Quería saber cómo venís con la idea de mudarte, ¿pudiste ver nuestra página? Quedamos a las órdenes!
            </div>
            <div className="text-right text-[10px] text-l-faint mb-4">10:08 ✓✓</div>
            <div className="bg-l-subtle rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%] mb-1">
              Martín! Siempre atento a la jugada... estamos analizando la posibilidad de vender, todavía no tomamos ninguna decisión pero quedate tranquilo que sos la primera opción de contacto 💪
            </div>
            <div className="text-left text-[10px] text-l-faint mb-6">10:10</div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-l-border" />
              <span className="text-[11px] text-l-micro tracking-widest shrink-0">1 MES DESPUÉS</span>
              <div className="flex-1 h-px bg-l-border" />
            </div>
            <div className="text-center text-[11px] text-l-faint mb-4">10 de abril</div>
            <div className="bg-primary rounded-2xl rounded-br-sm p-3 text-sm text-white ml-auto max-w-[85%] mb-1">
              Carlos, ¿cómo estás? Paso por acá para saludarte y retomar el contacto. ¿Cómo lo estás viendo ahora?
            </div>
            <div className="text-right text-[10px] text-l-faint mb-4">10:09 ✓✓</div>
            <div className="bg-l-subtle rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%] mb-1">
              Justo andaba por escribirte! Al final decidimos que vamos a poner todo a la venta 🙌
            </div>
            <div className="text-left text-[10px] text-l-faint">10:11</div>
          </div>
        </div>
      </section>

      {/* Solución */}
      <section className="px-8 py-28">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1] mb-6">
            OnMind mantiene<br />el vínculo por vos
          </h2>
          <p className="text-lg text-l-muted max-w-[560px] mx-auto mb-14">
            Conectás tu WhatsApp, cargás tus contactos, definís qué mensajes enviar. OnMind se encarga del resto.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { icon: Shield, text: "Tu número real, no un bot desconocido" },
              { icon: Timer, text: "El mensaje justo, en el momento justo" },
              { icon: UserPlus, text: "Una persona donde antes necesitabas un equipo" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-l-card border border-l-border rounded-2xl px-6 py-4 text-left flex-1 min-w-[280px] max-w-[340px] hover:border-primary-light transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-[10px] bg-teal-10 text-primary-light flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[15px] font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-28">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] mb-14 text-center">Lo que podés hacer</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: "Plan de seguimiento", desc: "OnMind distribuye los contactos a lo largo del año para que siempre estés presente sin saturar a nadie." },
              { icon: Users, title: "Contactos organizados", desc: "Categorizá por nivel de relación, etiquetas y tipo. Sabé exactamente a quién escribirle y cuándo." },
              { icon: CalendarDays, title: "Mensajes programados", desc: "Configurá mensajes automáticos para cumpleaños, fechas especiales, o simplemente para no perder contacto." },
              { icon: MessageSquare, title: "Todo el historial", desc: "Conversaciones de WhatsApp centralizadas. Sabé qué se dijo, cuándo y por qué." },
              { icon: FileText, title: "Plantillas personales", desc: "Creá mensajes con el nombre del cliente, su empresa o cualquier dato. Cada mensaje se siente personal porque lo es." },
              { icon: Palmtree, title: "Modo vacaciones", desc: "Activás el modo vacaciones y OnMind pausa todo. Cuando volvés, retoma los envíos como si nada." },
            ].map((f) => (
              <div key={f.title} className="relative overflow-hidden bg-l-card border border-l-border rounded-2xl p-9 hover:border-primary-light/30 transition-colors">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,var(--teal-10)_0%,transparent_70%)] pointer-events-none" />
                <div className="w-11 h-11 rounded-xl bg-teal-10 text-primary-light flex items-center justify-center mb-5">
                  <f.icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-l-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="px-8 py-28">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] mb-16 text-center">Arrancás en minutos</h2>
          <div className="flex flex-col">
            {[
              { num: "1", title: "Conectá tu WhatsApp", desc: "Escaneás un código QR con tu celular y listo. Tu número, tu WhatsApp, tus clientes." },
              { num: "2", title: "Cargá tus contactos", desc: "Importá tu base de clientes y organizalos por categoría. OnMind sugiere una frecuencia de contacto para cada nivel." },
              { num: "3", title: "Configurá y olvidate", desc: "Elegí qué mensajes enviar, cuándo y a quién. OnMind los programa y los envía. Vos solo revisás las respuestas." },
            ].map((step) => (
              <div key={step.num} className="grid grid-cols-[80px_1fr] gap-8 py-8 border-t border-l-border last:border-b">
                <div className="text-6xl font-extrabold leading-none bg-gradient-to-b from-primary-light to-primary-light/20 bg-clip-text text-transparent">{step.num}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{step.title}</h3>
                  <p className="text-[15px] text-l-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="px-8 py-28">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[28px] font-semibold leading-[1.5] mb-8 tracking-[-0.01em]">
            Pasamos de dos personas full-time enviando mensajes a{" "}
            <span className="text-l-muted font-normal">una sola persona revisando unos minutos al día. Cero olvidos. Más tiempo para lo que importa.</span>
          </p>
          <div className="flex gap-4 items-center pt-6 border-t border-l-border">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-lg font-bold text-white">M</div>
            <div>
              <span className="block text-[15px] font-semibold">Martín</span>
              <span className="block text-[13px] text-l-muted">Agente inmobiliario, Uruguay</span>
            </div>
          </div>
          <div className="mt-12 p-8 bg-l-card border border-l-border rounded-2xl">
            <p className="text-base text-l-muted leading-[1.7] mb-4">
              Martín tenía un sistema de comunicación con clientes que le daba resultados extraordinarios: planillas compartidas, recordatorios manuales, dos personas dedicadas. Funcionaba, pero era insostenible.
            </p>
            <p className="text-base text-primary-light font-medium leading-[1.7]">
              Lo que antes era un método que pocos podían replicar, ahora es una herramienta que cualquier negocio puede usar desde el día uno.
            </p>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="px-8 py-28">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] mb-12 text-center">
            Hecho para negocios<br />que viven de sus clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Inmobiliarias", desc: "Que tu cliente te llame a vos cuando aparezca una propiedad, no al competidor." },
              { title: "Profesionales independientes", desc: "Abogados, contadores, asesores — mantené el vínculo sin dedicarle horas." },
              { title: "Negocios con cartera", desc: "Si tu negocio depende de que los clientes vuelvan, OnMind te ayuda a que no se olviden de vos." },
            ].map((p) => (
              <div key={p.title} className="p-9 bg-l-card border border-l-border rounded-2xl hover:border-primary-light hover:-translate-y-1 transition-all">
                <h3 className="text-lg font-bold text-primary-light mb-2">{p.title}</h3>
                <p className="text-sm text-l-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative px-8 py-40 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,171,137,.12)_0%,transparent_70%)] pointer-events-none" />
        <CirclesMotif className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        <h2 className="relative z-10 text-4xl md:text-[52px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5">
          Dejá de perder clientes<br />por falta de contacto
        </h2>
        <p className="relative z-10 text-lg text-l-muted mb-10">
          Conectá tu WhatsApp y empezá a estar presente en la mente de tus clientes.
        </p>
        <a href="/login" className="relative z-10 inline-flex items-center gap-2.5 bg-primary text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:bg-primary-light hover:shadow-[0_0_40px_rgba(0,171,137,.3)] hover:-translate-y-0.5 transition-all">
          Solicita una demo <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Footer */}
      <footer className="max-w-[1100px] mx-auto px-8 py-8 border-t border-l-border flex justify-between items-center text-[13px] text-l-muted">
        <span>&copy; 2026 OnMind</span>
        <nav className="flex gap-5 items-center">
          <a href="#features" className="hover:text-l-text transition-colors">Funciones</a>
          <a href="#como-funciona" className="hover:text-l-text transition-colors">Proceso</a>
          <a href="/login" className="hover:text-l-text transition-colors">Iniciar sesión</a>
          <ThemeToggle />
        </nav>
      </footer>
    </div>
  );
}
