"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/image-gallery"
import { setActiveGenerationAction } from "@/app/dashboard/piezas/[slug]/actions"
import { Loader2 } from "lucide-react"

type Generation = {
  id: string
  imageUrl: string
  model: string
  costUsd: number
  durationMs: number
  isActive: boolean
  createdAt: Date
}

export function GenerationHistory({
  slug,
  generations,
  totalCost,
}: {
  slug: string
  generations: Generation[]
  totalCost: number
}) {
  const router = useRouter()
  const [activating, setActivating] = useState<string | null>(null)

  const galleryImages = generations.map((gen, i) => ({
    src: gen.imageUrl,
    alt: `Generación #${generations.length - i}`,
  }))

  async function handleSetActive(generationId: string) {
    setActivating(generationId)
    await setActiveGenerationAction(slug, generationId)
    setActivating(null)
    router.refresh()
  }

  return (
    <div className="border-t pt-4">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Generaciones ({generations.length}) · Total: ${totalCost.toFixed(2)}
      </p>
      <div className="space-y-2">
        {generations.map((gen, i) => (
          <ImageGallery
            key={gen.id}
            images={galleryImages}
            startIndex={i}
            trigger={
              <div
                className={`border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors ${
                  gen.isActive ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 w-20">
                    <img
                      src={gen.imageUrl}
                      alt={`Generación #${generations.length - i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 px-3 py-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          #{generations.length - i}
                        </span>
                        {gen.isActive && (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-primary border-primary/20"
                          >
                            Activa
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        ${gen.costUsd.toFixed(2)}
                      </span>
                    </div>
                    <div className="my-auto text-xs text-muted-foreground">
                      {gen.model.split("/").pop()}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs text-muted-foreground">
                        {(gen.durationMs / 1000).toFixed(1)}s · {new Date(gen.createdAt).toLocaleDateString("es-UY")}
                      </span>
                      {!gen.isActive && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSetActive(gen.id)
                          }}
                          disabled={activating !== null}
                        >
                          {activating === gen.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Usar esta"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}
