"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";

type Props = {
  path: string;
  label?: string;
};

export function PdfLinkBar({ path, label = "Link público del PDF" }: Props) {
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard bloqueado: ignorar
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg border bg-muted/40 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 min-w-0 truncate rounded bg-background px-3 py-1.5 text-xs border">
          {buildUrl()}
        </code>
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar link
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a href={path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Abrir PDF
          </a>
        </Button>
      </div>
    </div>
  );
}
