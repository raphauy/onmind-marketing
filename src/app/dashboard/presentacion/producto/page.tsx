import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PdfLinkBar } from "@/components/pdf-link-bar";

export default function ProductoPage() {
  const filePath = path.join(
    process.cwd(),
    "docs/presentacion/onmind-producto-2026-04-29.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl">
      <PdfLinkBar path="/presentacion/onmind-producto-2026-04-29.pdf" />
      <MarkdownRenderer content={content} />
    </div>
  );
}
