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
    </>
  )
}
