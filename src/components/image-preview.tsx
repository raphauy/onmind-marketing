"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ImagePreview({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full cursor-pointer">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-fit w-auto p-3">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <img
          src={src}
          alt={alt}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  )
}
