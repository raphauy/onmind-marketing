import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function MarcaPage() {
  const filePath = path.join(
    process.cwd(),
    "docs/branding/onmind-guia-de-marca-2026-04-07.md"
  );
  let content = fs.readFileSync(filePath, "utf-8");

  // Replace local file:// paths with public URLs
  content = content.replace(
    /file:\/\/\/home\/raphael\/desarrollo\/onmind-marketing\/assets\/logo\//g,
    "/brand/"
  );

  return (
    <div className="max-w-3xl">
      <MarkdownRenderer content={content} />
    </div>
  );
}
