import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, instagramPosts, frameworkDescriptions, objectiveDescriptions } from "@/lib/instagram-posts";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="-m-6 py-6 bg-gray-50">
      <div className="mx-auto max-w-[430px] border border-gray-200 rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-3 py-2.5 flex items-center gap-3">
          <Link
            href="/dashboard/instagram"
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
          <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden bg-white relative">
            <Image
              src="/brand/isotipo-OnMind-fondo-blanco.png"
              alt="OnMind"
              fill
              className="object-cover scale-125"
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
            src={post.image}
            alt={post.topic}
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

        {/* Caption */}
        <div className="px-3 pb-3">
          <div className="text-sm">
            <span className="font-semibold">onmindapp</span>{" "}
            <span className="whitespace-pre-line">{post.caption}</span>
          </div>
          {/* Hashtags */}
          <p className="text-sm text-[#00376b] mt-2">
            {post.hashtags.join(" ")}
          </p>
        </div>

      </div>

      {/* Info del post — fuera de la caja del celular */}
      <div className="mx-auto max-w-[430px] mt-6">
        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Detalles del post</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-md px-3 py-2">
              <span className="text-[11px] text-gray-400 block">Pilar</span>
              <span className="font-medium text-gray-800">{post.typeLabel}</span>
            </div>
            <div className="bg-gray-50 rounded-md px-3 py-2">
              <span className="text-[11px] text-gray-400 block">Tema</span>
              <span className="font-medium text-gray-800">{post.topic}</span>
            </div>
            <div className="bg-gray-50 rounded-md px-3 py-2">
              <span className="text-[11px] text-gray-400 block">Framework</span>
              <span className="font-medium text-gray-800">{post.framework}</span>
              {frameworkDescriptions[post.framework] && (
                <span className="text-[11px] text-gray-500 block mt-0.5">{frameworkDescriptions[post.framework]}</span>
              )}
            </div>
            <div className="bg-gray-50 rounded-md px-3 py-2">
              <span className="text-[11px] text-gray-400 block">Objetivo</span>
              <span className="font-medium text-gray-800">{post.objective}</span>
              {objectiveDescriptions[post.objective] && (
                <span className="text-[11px] text-gray-500 block mt-0.5">{objectiveDescriptions[post.objective]}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return instagramPosts.map((p) => ({ post: p.slug }));
}
