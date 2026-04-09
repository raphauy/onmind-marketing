import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const versions = [
  {
    slug: "bold",
    title: "V1 — Bold",
    description:
      "Hero con gradiente oscuro, features sobre fondo dark, más impacto visual.",
  },
  {
    slug: "creative",
    title: "V2 — Creative",
    description:
      "Fondo oscuro, círculos concéntricos, chat simulado, bento grid. La versión activa.",
  },
];

export default function LandingsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Landings</h1>
      <p className="text-muted-foreground mb-8">
        2 versiones visuales de la landing de OnMind. Mismo contenido, distinto
        diseño.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {versions.map((v) => (
          <a
            key={v.slug}
            href={`/landings/${v.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="hover:border-[#007056]/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {v.title}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{v.description}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
