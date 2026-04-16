"use client";

import { useState } from "react";
import { publishPostAction } from "@/app/dashboard/instagram/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublishButtonProps {
  slug: string;
  isPublished: boolean;
  publishedAt?: string;
}

export function InstagramPublishButton({ slug, isPublished, publishedAt }: PublishButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(isPublished);
  const [pubDate, setPubDate] = useState(publishedAt);

  if (published && pubDate) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span className="text-sm font-medium text-green-800">
          Publicado el {new Date(pubDate).toLocaleDateString("es-UY", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>
    );
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const result = await publishPostAction(slug);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      setPublished(true);
      setPubDate(result.data?.publishedAt);
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <Button
        className="w-full gap-2 bg-[#007056] hover:bg-[#00876D] text-white h-11"
        onClick={() => setOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        </svg>
        Publicar en Instagram
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>¿Publicar en Instagram?</DialogTitle>
            <DialogDescription>
              Este post se publicará ahora en la cuenta @OnMindApp. Esta acción no se puede deshacer desde acá.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}
          <DialogFooter className="grid grid-cols-2 gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-[#007056] hover:bg-[#00876D]"
            >
              {loading ? "Publicando..." : "Sí, publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
