# Investigación: Skills, Agentes y MCPs de Marketing para Claude Code

**Autor:** Raphael & Claude AI
**Fecha:** 2026-04-08

---

## Resumen ejecutivo

El ecosistema de Claude Code para marketing tiene tres capas:
1. **Skills** — archivos SKILL.md que extienden Claude con flujos de marketing (copy, estrategia, redes)
2. **Servidores MCP** — conectan Claude con plataformas reales (Instagram, Canva, scheduling)
3. **Patrones multi-agente** — simulan equipos completos de marketing

Limitación clave: Claude no genera imágenes nativamente. Para contenido visual se necesita MCP hacia Canva, Midjourney, o similar.

---

## Skills de marketing disponibles

### coreyhaines31/marketingskills — PAQUETE MÁS COMPLETO

**URL:** github.com/coreyhaines31/marketingskills
**Instalación:** `npx skillkit install coreyhaines31/marketingskills`
**Madurez:** Alta

| Categoría | Skills |
|---|---|
| Content & Copy | `copywriting`, `copy-edit`, `cold-email`, `email-seq`, `social-content`, `content-strategy` |
| CRO | `page-cro`, `signup-cro`, `onboard`, `form-cro` |
| SEO | `seo-audit`, `ai-seo`, `site-arch`, `programm` |
| Paid | `paid-ads`, `ad-creative`, `ab-test`, `analytics` |
| Growth | `referral`, `free-tool`, `churn-prevent` |
| Strategy | `mktg-ideas`, `mktg-psych` |

**Relevancia OnMind:** ALTA. Cubre copywriting para landing, estrategia de contenidos, email, ads, y CRO.

---

### zubair-trabzada/ai-marketing-claude — SUITE CON SUBAGENTES PARALELOS

**URL:** github.com/zubair-trabzada/ai-marketing-claude
**Madurez:** Media

Skills: `/market audit <URL>` (5 agentes paralelos), `/market-copy`, `/market-emails`, `/market-social`, `/market-ads`, `/market-funnel`, `/market-competitors`, `/market-landing`, `/market-launch`, `/market-proposal`, `/market-brand`, `/market-seo`, `/market-report`, `/market-report-pdf`

**Relevancia OnMind:** ALTA. `/market audit https://www.onmindcrm.com` para diagnóstico del sitio actual. `/market-landing` para CRO.

---

### stevenflanagan1/social-ai-team — EQUIPO DE REDES SOCIALES

**URL:** github.com/stevenflanagan1/social-ai-team
**Madurez:** Media

Agentes: `/social-media-manager`, `/brand-onboarding`, `/content-calendar`, `/caption-writer`, `/social-creative-designer`, `/social-performance-review`

**Relevancia OnMind:** ALTA para operación mensual de Instagram. Flujo: brand-onboarding → content-calendar → caption-writer.

---

### WomenDefiningAI/claudecode-writer — CONTENT REPURPOSING

**URL:** github.com/WomenDefiningAI/claudecode-writer
**Madurez:** Media

Flujo: Nota/idea raw → Investigación → Artículo largo → Versiones para LinkedIn, Newsletter, Redes sociales, Podcast Q&A. Aprende la voz del autor.

**Relevancia OnMind:** MEDIA-ALTA. Útil para convertir insights de Martín en contenido multi-formato.

---

### Otros

- **arturseo-geo/content-creation-skill** — Skill multiformat (blogs, landings, emails, social, video scripts). Relevancia MEDIA.
- **wshobson/agents** — 112 agentes, incluye plugin `content-marketing`. Relevancia MEDIA (overengineered para ahora).
- **anthropics/skills** — Skills oficiales de Anthropic. Incluye `brand-guidelines`. Relevancia MEDIA.
- **alirezarezvani/claude-skills** — 220+ skills variados. Relevancia MEDIA.

---

## Servidores MCP relevantes

### Canva MCP — DISEÑO PROGRAMÁTICO

**URL:** canva.dev/docs/mcp | Servidor: `https://mcp.canva.com/mcp`
**Madurez:** Alta (oficial de Canva)

Genera diseños desde texto, edita diseños existentes, busca templates, exporta. Plan Free cubre lo básico. Pro agrega resize. Enterprise agrega autofill y brand kits.

**Relevancia OnMind:** MUY ALTA. Resuelve contenido visual sin diseñador.

---

### Instagram MCPs

**Opción recomendada: mcpware/instagram-mcp**
- 23 herramientas: publicar fotos/carousels, insights, DMs, hashtag discovery
- Requiere: Instagram Business + Facebook Page + Meta API token
- Instalación: `npx @mcpware/instagram-mcp`

Alternativas: jlbadano/ig-mcp (Python), Composio Instagram Toolkit (comercial).

---

### Scheduling multi-plataforma

- **PostFast MCP** (postfa.st) — 10+ plataformas, scheduling desde Claude. Comercial.
- **Postiz** (postiz.com) — Open source, self-hosteable, 19+ redes. AGPL-3.0.
- **Ayrshare** (ayrshare.com) — API-first, 13+ plataformas, desde $24.99/mes.

---

### Imagen y diseño (alternativas a Canva)

- Midjourney MCP (AceDataCloud/MidjourneyMCP)
- mcp-image (shinpr) — vía Gemini
- FLUX / Stable Diffusion via MCP (varios servidores comunitarios)

---

## Directorios para descubrir más

| Recurso | URL |
|---|---|
| Claude Code Skills Docs (oficial) | code.claude.com/docs/en/skills |
| AgentSkills Directory | directory.agentskills.ai (37,000+ skills) |
| skills.sh | skills.sh |
| SkillsMP | skillsmp.com |
| MCPMarket | mcpmarket.com |
| PulseMCP | pulsemcp.com |
| Glama | glama.ai/mcp/servers |

---

## Gap identificado

No existe skill específico para **WhatsApp marketing** ni para el nicho **inmobiliario**. Oportunidad: construir skills propios con contexto del producto, tono de marca y casos de uso del sector.

---

## Recomendación: stack mínimo viable

1. **coreyhaines31/marketingskills** — copy, estrategia, contenido
2. **stevenflanagan1/social-ai-team** — flujo mensual de Instagram
3. **Canva MCP** — contenido visual
4. **mcpware/instagram-mcp** — publicar y medir desde Claude

Para evaluar después:
- zubair-trabzada/ai-marketing-claude para auditoría de landing
- PostFast/Postiz para scheduling
- Google Search Console MCP cuando se active blog/SEO
