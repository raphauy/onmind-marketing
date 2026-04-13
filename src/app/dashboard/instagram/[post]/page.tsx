import Image from "next/image";
import Link from "next/link";
import { readdirSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";

function getPostFile(slug: string) {
  const postsDir = join(process.cwd(), "public/instagram/posts");
  try {
    const files = readdirSync(postsDir).filter((f) => f.endsWith(".png"));
    const match = files.find((f) => f.replace(".png", "") === slug);
    if (!match) return null;
    return {
      src: `/instagram/posts/${match}`,
      slug,
    };
  } catch {
    return null;
  }
}

function parsePostName(slug: string) {
  const parts = slug.split("-");
  const number = parts[0];
  const type = parts[1];
  const rawDesc = parts.slice(2).join(" ");
  const typeLabels: Record<string, string> = {
    educacion: "Educación",
    dolor: "Dolor del rubro",
    producto: "Producto",
  };
  // Slugs don't support ñ/accents — map them back to proper Spanish
  const descFixes: Record<string, string> = {
    "cumpleanos": "Cumpleaños",
    "escribile primero": "Escribile primero",
    "conecta whatsapp": "Conectá tu WhatsApp",
    "5 fechas": "5 fechas clave",
    "cerro con otro": "Cerró con otro",
    "seguimiento": "Seguimiento",
    "vencimiento": "Vencimiento",
    "vinculo": "Vínculo",
  };
  return {
    number,
    type: typeLabels[type] || type,
    description: descFixes[rawDesc] || rawDesc,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = getPostFile(slug);
  if (!post) notFound();

  const meta = parsePostName(slug);

  return (
    <div className="-m-6 py-6 bg-gray-50">
      <div className="mx-auto max-w-[430px] border border-gray-200 rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-3 py-2.5 flex items-center gap-3">
          <Link
            href="/dashboard/instagram"
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <span className="font-semibold text-base">Publicaciones</span>
        </div>

        {/* Post author row */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/brand/isotipo-OnMind-fondo-blanco.png"
              alt="OnMind"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">onmindapp</span>
          </div>
          <div className="ml-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </div>
        </div>

        {/* Post image */}
        <div className="relative w-full aspect-square bg-gray-50">
          <Image
            src={post.src}
            alt={slug}
            fill
            className="object-contain"
            sizes="430px"
            priority
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        {/* Caption area */}
        <div className="px-3 pb-4">
          <p className="text-sm">
            <span className="font-semibold">onmindapp</span>{" "}
            <span className="text-gray-500 italic text-xs">(caption pendiente)</span>
          </p>
          {/* Post metadata */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-medium text-white bg-gray-800 rounded px-1.5 py-0.5">
              {meta.type}
            </span>
            <span className="text-xs text-gray-400 capitalize">{meta.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
