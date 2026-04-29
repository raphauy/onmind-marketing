import { SlideDeck } from "@/components/slide-deck";
import { demoSlides } from "@/lib/demo-slides";

export default function StandaloneSlidesPage() {
  return <SlideDeck slides={demoSlides} fullViewport />;
}
