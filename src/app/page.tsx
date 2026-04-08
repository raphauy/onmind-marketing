import { OnMindLogo } from "@/components/logo";
import {
  Clock,
  Users,
  CalendarDays,
  MessageSquare,
  FileText,
  BarChart3,
  Shield,
  Timer,
  UserPlus,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

function CirclesMotif({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full border border-dark-border pointer-events-none ${className}`} />;
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-dark-card/85 backdrop-blur-xl border border-dark-border rounded-full px-5 py-1.5">
        <a href="#features" className="text-[13px] text-dark-muted px-3.5 py-1.5 rounded-full hover:text-white hover:bg-teal-10 transition-all">Funciones</a>
        <a href="#como-funciona" className="text-[13px] text-dark-muted px-3.5 py-1.5 rounded-full hover:text-white hover:bg-teal-10 transition-all">Proceso</a>
        <a href="#historia" className="text-[13px] text-dark-muted px-3.5 py-1.5 rounded-full hover:text-white hover:bg-teal-10 transition-all">Historia</a>
        <a href="/login" className="bg-primary text-white font-semibold text-[13px] px-5 py-2 rounded-full ml-1 hover:bg-primary-light transition-all">Ingresar</a>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,171,137,.15)_0%,transparent_70%)] pointer-events-none" />
        <CirclesMotif className="w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CirclesMotif className="w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        <div className="relative z-10 mb-12">
          <OnMindLogo className="h-12" color="#fff" />
        </div>

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em] max-w-[800px] mb-7">
          Que tus clientes<br />
          <span className="bg-gradient-to-r from-primary-light to-primary-glow bg-clip-text text-transparent">piensen en vos</span><br />
          cuando te necesiten
        </h1>

        <p className="relative z-10 text-xl text-dark-muted max-w-[500px] mb-11">
          OnMind envía mensajes por WhatsApp por vos, con tu número real, en el momento justo.
        </p>

        <a href="/login" className="relative z-10 inline-flex items-center gap-2.5 bg-primary text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:bg-primary-light hover:shadow-[0_0_40px_rgba(0,171,137,.3)] hover:-translate-y-0.5 transition-all">
          Solicitar demo <ArrowRight className="w-4 h-4" />
        </a>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-dark-muted text-[13px] flex flex-col items-center gap-2 animate-bounce">
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
              <span className="text-white/30">Es que tus clientes<br />se olvidan de vos.</span>
            </h2>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-6 bg-dark px-3 py-1 rounded-full text-[11px] text-dark-muted border border-dark-border uppercase tracking-wider font-semibold">WhatsApp</span>
            <div className="text-center text-[11px] text-white/25 mb-4">Lunes 9:00</div>
            <div className="bg-primary rounded-2xl rounded-br-sm p-3 text-sm ml-auto max-w-[85%] mb-2.5">
              Hola María! Cómo estás? Te escribo porque vi una propiedad que te puede interesar...
            </div>
            <div className="bg-white/8 rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%] mb-5">
              Ah genial Martín, justo estaba buscando!
            </div>
            <div className="flex items-center justify-center h-5 mb-5">
              <span className="text-[11px] text-white/20 tracking-widest">3 MESES DESPUÉS</span>
            </div>
            <div className="text-center text-[11px] text-white/25 mb-4">Jueves 14:22</div>
            <div className="bg-red-500/15 border border-red-500/30 rounded-2xl rounded-br-sm p-3 text-sm ml-auto max-w-[85%] mb-5 text-white/60">
              Borrador: Hola María, quería saber si seguís... <span className="opacity-50">— No enviado</span>
            </div>
            <div className="bg-white/8 rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%]">
              Hola! Quería contarte que al final compré con otra inmobiliaria. Gracias igual!
            </div>
          </div>
        </div>
      </section>

      {/* Solución */}
      <section className="px-8 py-28">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1] mb-6">
            OnMind mantiene<br />el vínculo por vos
          </h2>
          <p className="text-lg text-dark-muted max-w-[560px] mx-auto mb-14">
            Conectás tu WhatsApp, cargás tus contactos, definís qué mensajes enviar. OnMind se encarga del resto.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { icon: Shield, text: "Tu número real, no un bot desconocido" },
              { icon: Timer, text: "El mensaje justo, en el momento justo" },
              { icon: UserPlus, text: "Una persona donde antes necesitabas un equipo" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-left flex-1 min-w-[280px] max-w-[340px] hover:border-primary-light transition-colors">
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
              { icon: BarChart3, title: "Métricas claras", desc: "Cuántos mensajes se enviaron, entregaron y leyeron. Sin misterios." },
            ].map((f) => (
              <div key={f.title} className="relative overflow-hidden bg-dark-card border border-dark-border rounded-2xl p-9 hover:border-primary-light/30 transition-colors">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,var(--color-teal-10)_0%,transparent_70%)] pointer-events-none" />
                <div className="w-11 h-11 rounded-xl bg-teal-10 text-primary-light flex items-center justify-center mb-5">
                  <f.icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-dark-muted leading-relaxed">{f.desc}</p>
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
              <div key={step.num} className="grid grid-cols-[80px_1fr] gap-8 py-8 border-t border-dark-border last:border-b">
                <div className="text-6xl font-extrabold leading-none bg-gradient-to-b from-primary-light to-primary-light/20 bg-clip-text text-transparent">{step.num}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{step.title}</h3>
                  <p className="text-[15px] text-dark-muted">{step.desc}</p>
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
            <span className="text-dark-muted font-normal">una sola persona revisando unos minutos al día. Cero olvidos. Más tiempo para lo que importa.</span>
          </p>
          <div className="flex gap-4 items-center pt-6 border-t border-dark-border">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-lg font-bold">M</div>
            <div>
              <span className="block text-[15px] font-semibold">Martín</span>
              <span className="block text-[13px] text-dark-muted">Agente inmobiliario, Uruguay</span>
            </div>
          </div>
          <div className="mt-12 p-8 bg-dark-card border border-dark-border rounded-2xl">
            <p className="text-base text-dark-muted leading-[1.7] mb-4">
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
              <div key={p.title} className="p-9 bg-dark-card border border-dark-border rounded-2xl hover:border-primary-light hover:-translate-y-1 transition-all">
                <h3 className="text-lg font-bold text-primary-light mb-2">{p.title}</h3>
                <p className="text-sm text-dark-muted leading-relaxed">{p.desc}</p>
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
        <p className="relative z-10 text-lg text-dark-muted mb-10">
          Conectá tu WhatsApp y empezá a estar presente en la mente de tus clientes.
        </p>
        <a href="/login" className="relative z-10 inline-flex items-center gap-2.5 bg-primary text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:bg-primary-light hover:shadow-[0_0_40px_rgba(0,171,137,.3)] hover:-translate-y-0.5 transition-all">
          Solicita una demo <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Footer */}
      <footer className="max-w-[1100px] mx-auto px-8 py-8 border-t border-dark-border flex justify-between items-center text-[13px] text-white/30">
        <span>&copy; 2026 OnMind</span>
        <nav className="flex gap-5">
          <a href="#features" className="hover:text-dark-muted transition-colors">Funciones</a>
          <a href="#como-funciona" className="hover:text-dark-muted transition-colors">Proceso</a>
          <a href="/login" className="hover:text-dark-muted transition-colors">Iniciar sesión</a>
        </nav>
      </footer>
    </div>
  );
}
