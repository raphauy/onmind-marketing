import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function GuionDemoPage() {
  const filePath = path.join(
    process.cwd(),
    "docs/presentacion/onmind-guion-video-demo-2026-04-22.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl">
      <MarkdownRenderer content={content} />
    </div>
  );
}
