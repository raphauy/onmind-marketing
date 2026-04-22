import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PdfLinkBar } from "@/components/pdf-link-bar";

export default function BrochurePage() {
  const filePath = path.join(
    process.cwd(),
    "docs/presentacion/onmind-brochure-2026-04-22.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl">
      <PdfLinkBar path="/presentacion/onmind-brochure-2026-04-22.pdf" />
      <MarkdownRenderer content={content} />
    </div>
  );
}
