import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function EstrategiaInstagramPage() {
  const filePath = path.join(
    process.cwd(),
    "docs/planes/instagram/onmind-instagram-estrategia-2026-04-10.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl">
      <MarkdownRenderer content={content} />
    </div>
  );
}
