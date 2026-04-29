import { SlideDeck } from "@/components/slide-deck";
import { demoSlides } from "@/lib/demo-slides";

export default function SlidesPage() {
  return (
    <div className="-m-6">
      <SlideDeck slides={demoSlides} />
    </div>
  );
}
