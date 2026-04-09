import { OnMindLogo } from "@/components/logo";
import * as c from "@/lib/landing-content";
import {
  Users, CalendarDays, MessageSquare, Zap, FileText, Palmtree,
} from "lucide-react";

const featureIcons = [Users, CalendarDays, MessageSquare, Zap, FileText, Palmtree];

export default function BoldLanding() {
  return (
    <div className="bg-[#FEFEFE] text-[#0A0A0A] min-h-screen">
      {/* Hero wrap (dark) */}
      <div className="bg-gradient-to-br from-[#0C1F1A] via-[#004A37] to-[#007056] text-white relative pb-24 overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,171,137,.2)_0%,transparent_70%)] pointer-events-none" />

        <header className="flex items-center justify-between max-w-[1200px] mx-auto px-10 py-5 relative z-10">
          <OnMindLogo className="h-14" color="#fff" />
          <nav className="flex gap-8 items-center">
            <a href="#features" className="text-[15px] text-white/70 hover:text-white font-medium">Características</a>
            <a href="#como-funciona" className="text-[15px] text-white/70 hover:text-white font-medium">Cómo funciona</a>
            <a href="#historia" className="text-[15px] text-white/70 hover:text-white font-medium">La historia</a>
            <span className="bg-white text-[#004A37] px-5 py-2 rounded-full text-sm font-semibold">Solicita una demo</span>
          </nav>
        </header>

        <section className="max-w-[800px] mx-auto px-10 pt-20 pb-10 text-center relative z-10">
          <h1 className="text-[56px] font-black leading-[1.1] tracking-tight mb-6">
            Que tus clientes <em className="not-italic text-[#00AB89]">piensen en vos</em> cuando te necesiten
          </h1>
          <p className="text-xl opacity-80 mb-10 max-w-[580px] mx-auto">{c.hero.subheadline}</p>
          <div className="flex gap-4 justify-center">
            <span className="bg-white text-[#004A37] px-9 py-4 rounded-full text-[17px] font-semibold">{c.hero.ctaPrimary} →</span>
            <a href="#como-funciona" className="border-2 border-white/30 text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:border-white hover:bg-white/10">{c.hero.ctaSecondary}</a>
          </div>
        </section>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#FEFEFE]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      {/* Problema */}
      <section className="max-w-[1200px] mx-auto px-10 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#007056] mb-3 block">El problema</span>
            <h2 className="text-3xl font-extrabold leading-snug">El problema no es tu servicio.<br /><em className="not-italic text-[#007056]">Es que tus clientes se olvidan de vos.</em></h2>
          </div>
          <div className="flex flex-col gap-6">
            {c.problema.items.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center">{i + 1}</span>
                <p className="text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solución */}
      <section className="bg-[#E1F3ED] py-24 px-10">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#007056] mb-3 block">La solución</span>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">{c.solucion.title}</h2>
            <p className="text-[17px] text-[#737373] mb-8">{c.solucion.descripcion}</p>
          </div>
          <ul className="flex flex-col gap-5">
            {c.solucion.puntos.map((p, i) => (
              <li key={i} className="flex gap-3.5 items-start text-base">
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#007056] text-white text-xs font-bold flex items-center justify-center">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features (dark) */}
      <section id="features" className="bg-[#0C1F1A] text-white py-24 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#00AB89] mb-3 block">Características</span>
            <h2 className="text-4xl font-extrabold tracking-tight">Lo que podés hacer con OnMind</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {c.features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={f.title} className="p-8 rounded-2xl bg-[#132B24] border border-white/8 hover:border-[#00AB89] hover:-translate-y-0.5 transition-all">
                  <Icon className="w-7 h-7 text-[#00AB89] mb-4" />
                  <h3 className="text-[17px] font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-24 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#007056] mb-3 block">Cómo funciona</span>
            <h2 className="text-4xl font-extrabold tracking-tight">Arrancás en minutos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {c.pasos.map((s) => (
              <div key={s.num} className="relative p-8 rounded-2xl bg-[#F4F4F4] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007056] to-[#00AB89] text-white text-[26px] font-extrabold flex items-center justify-center mx-auto mb-5">{s.num}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[#737373]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="bg-[#F4F4F4] py-24 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#007056] mb-3 block">Caso real</span>
            <h2 className="text-4xl font-extrabold tracking-tight">{c.historia.title}</h2>
          </div>
          <div className="max-w-[760px] mx-auto bg-white rounded-2xl p-12 border border-[#E5E5E5] relative">
            <span className="absolute top-5 left-8 text-7xl text-[#E1F3ED] font-serif leading-none">&ldquo;</span>
            <p className="text-[17px] text-[#737373] mb-5 leading-relaxed relative">{c.historia.texto}</p>
            <p className="text-lg text-[#0A0A0A] font-semibold mb-5 leading-relaxed relative">{c.historia.resultado}</p>
            <p className="text-xl font-bold text-[#007056] mt-7 pt-6 border-t-2 border-[#E1F3ED] relative">{c.historia.cierre}</p>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="py-24 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[13px] font-bold tracking-widest uppercase text-[#007056] mb-3 block">¿Es para vos?</span>
            <h2 className="text-4xl font-extrabold tracking-tight">{c.paraQuien.descripcion}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {c.paraQuien.perfiles.map((p) => (
              <div key={p.title} className="p-8 rounded-2xl border-2 border-[#E5E5E5] text-center hover:border-[#007056] transition-all">
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-[#737373]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final (dark) */}
      <section className="text-center py-24 px-10 bg-gradient-to-br from-[#0C1F1A] to-[#004A37] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-[#FEFEFE]" style={{ clipPath: "ellipse(55% 100% at 50% 0%)" }} />
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 relative z-10">{c.ctaFinal.title}</h2>
        <p className="text-lg opacity-75 mb-9 relative z-10">{c.ctaFinal.descripcion}</p>
        <span className="bg-white text-[#004A37] px-9 py-4 rounded-full text-[17px] font-semibold relative z-10">{c.ctaFinal.cta} →</span>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between max-w-[1200px] mx-auto px-10 py-7 border-t border-[#E5E5E5] text-sm text-[#737373]">
        <span>© 2026 OnMind. Todos los derechos reservados.</span>
        <nav className="flex gap-6">
          <a href="#features" className="hover:text-[#0A0A0A]">Características</a>
          <a href="#como-funciona" className="hover:text-[#0A0A0A]">Cómo funciona</a>
        </nav>
      </footer>
    </div>
  );
}
