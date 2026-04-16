"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type GalleryImage = {
  src: string
  alt: string
}

export function ImageGallery({
  images,
  startIndex = 0,
  trigger,
}: {
  images: GalleryImage[]
  startIndex?: number
  trigger: React.ReactNode
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(startIndex)
  const [open, setOpen] = useState(false)

  // Scroll to startIndex when dialog opens
  useEffect(() => {
    if (!api || !open) return
    const t = setTimeout(() => api.scrollTo(startIndex, true), 50)
    return () => clearTimeout(t)
  }, [api, open, startIndex])

  // Track current slide
  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Global keyboard — dialog traps focus so we listen on window
  useEffect(() => {
    if (!open || !api) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        api.scrollPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        api.scrollNext()
      }
    }
    document.addEventListener("keydown", handler, true)
    return () => document.removeEventListener("keydown", handler, true)
  }, [open, api])

  if (images.length === 0) return null

  // Single image — no carousel
  if (images.length === 1) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            {trigger}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl max-w-[95vw] p-2 border-none shadow-none bg-transparent">
          <DialogTitle className="sr-only">{images[0].alt}</DialogTitle>
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-left cursor-pointer">
          {trigger}
        </div>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[90vw] max-w-[95vw] p-0 border-none shadow-none bg-transparent gap-0">
        <DialogTitle className="sr-only">
          Imagen {current + 1} de {images.length}
        </DialogTitle>

        <div className="relative">
          <Carousel setApi={setApi} opts={{ startIndex }}>
            <CarouselContent>
              {images.map((img, i) => (
                <CarouselItem
                  key={i}
                  className="flex items-center justify-center"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="max-h-[90vh] object-contain rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </Carousel>
          <DialogClose className="absolute -top-2 -right-2 bg-white text-gray-700 rounded-full p-1.5 shadow-md hover:bg-gray-100 cursor-pointer z-10">
            <X className="w-4 h-4" />
          </DialogClose>
        </div>

        <div className="text-center text-sm font-medium text-white mt-2">
          {current + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  )
}
