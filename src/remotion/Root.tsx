import { Composition } from "remotion"
// Path relativo (no alias @/) — el bundle Remotion usa su propio webpack
// y no conoce los path aliases de Next.js definidos en tsconfig.json.
import {
  REMOTION_FPS,
  templateDurationInFrames,
} from "../lib/remotion/config"
import {
  FraseAnimada,
  FraseAnimadaDefaults,
  fraseAnimadaSchema,
} from "./templates/FraseAnimada"
import {
  ChatAnimado,
  ChatAnimadoDefaults,
  chatAnimadoSchema,
} from "./templates/ChatAnimado"
import { TutorialDashboardA } from "./templates/TutorialDashboardA"
import { TutorialDashboardB } from "./templates/TutorialDashboardB"
import { TutorialTemplates } from "./templates/TutorialTemplates"
import { TutorialTemplates9x16 } from "./templates/TutorialTemplates9x16"
import { TutorialContactos } from "./templates/TutorialContactos"
import { TutorialContactos9x16 } from "./templates/TutorialContactos9x16"
import {
  TutorialThumbnailYT,
  TutorialThumbnailYTDefaults,
  tutorialThumbnailYTSchema,
} from "./templates/TutorialThumbnailYT"

// Convención: cada Composition.id matchea el slug del Template en la DB
// y es la clave por la que el generation-service va a llamar al render.
// Resoluciones: 9:16 = 1080×1920 para Reels/Stories.
export function RemotionRoot() {
  return (
    <>
      <Composition
        id="frase-animada"
        component={FraseAnimada}
        schema={fraseAnimadaSchema}
        durationInFrames={templateDurationInFrames("frase-animada")}
        fps={REMOTION_FPS}
        width={1080}
        height={1920}
        defaultProps={FraseAnimadaDefaults}
      />
      <Composition
        id="chat-animado"
        component={ChatAnimado}
        schema={chatAnimadoSchema}
        durationInFrames={templateDurationInFrames("chat-animado")}
        fps={REMOTION_FPS}
        width={1080}
        height={1920}
        defaultProps={ChatAnimadoDefaults}
      />
      <Composition
        id="tutorial-dashboard-a"
        component={TutorialDashboardA}
        durationInFrames={templateDurationInFrames("tutorial-dashboard-a")}
        fps={REMOTION_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="tutorial-dashboard-b"
        component={TutorialDashboardB}
        durationInFrames={templateDurationInFrames("tutorial-dashboard-b")}
        fps={REMOTION_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="tutorial-templates"
        component={TutorialTemplates}
        durationInFrames={templateDurationInFrames("tutorial-templates")}
        fps={REMOTION_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="tutorial-templates-9x16"
        component={TutorialTemplates9x16}
        durationInFrames={templateDurationInFrames("tutorial-templates-9x16")}
        fps={REMOTION_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="tutorial-contactos"
        component={TutorialContactos}
        durationInFrames={templateDurationInFrames("tutorial-contactos")}
        fps={REMOTION_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="tutorial-contactos-9x16"
        component={TutorialContactos9x16}
        durationInFrames={templateDurationInFrames("tutorial-contactos-9x16")}
        fps={REMOTION_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="tutorial-thumbnail-yt"
        component={TutorialThumbnailYT}
        schema={tutorialThumbnailYTSchema}
        durationInFrames={templateDurationInFrames("tutorial-thumbnail-yt")}
        fps={REMOTION_FPS}
        width={1280}
        height={720}
        defaultProps={TutorialThumbnailYTDefaults}
      />
    </>
  )
}
