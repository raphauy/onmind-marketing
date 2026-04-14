import Image from "next/image";
import Link from "next/link";
import { instagramPosts } from "@/lib/instagram-posts";
import { getPublishedPosts, getProfile } from "@/services/instagram-service";

export default async function InstagramPage() {
  const [published, profile] = await Promise.all([
    getPublishedPosts(),
    getProfile(),
  ]);
  const publishedSlugs = new Set(published.map((p) => p.slug));

  const gridPosts = [...instagramPosts].reverse();

  return (
    <div className="-m-6 py-6 px-6 bg-gray-50 min-h-full">
      <div className="mx-auto max-w-[700px] border border-gray-200 rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{profile.username}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div className="flex items-center gap-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </div>
        </div>

        {/* Profile section */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <div className="w-[86px] h-[86px] rounded-full border-[1.5px] border-gray-300 overflow-hidden bg-white relative">
                <Image
                  src={profile.profilePictureUrl}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="86px"
                />
              </div>
            </div>
            <div className="flex flex-1 justify-around text-center">
              <div>
                <span className="font-semibold text-base block">{profile.mediaCount}</span>
                <span className="text-xs text-gray-500">publicaciones</span>
              </div>
              <div>
                <span className="font-semibold text-base block">{profile.followers}</span>
                <span className="text-xs text-gray-500">seguidores</span>
              </div>
              <div>
                <span className="font-semibold text-base block">{profile.follows}</span>
                <span className="text-xs text-gray-500">seguidos</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <span className="font-semibold text-sm">{profile.name}</span>
            <p className="text-sm text-gray-800 mt-0.5 leading-snug whitespace-pre-line">
              {profile.biography}
            </p>
          </div>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg py-1.5 cursor-default">
              Editar perfil
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg py-1.5 cursor-default">
              Compartir perfil
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-2">
          <button className="flex-1 flex justify-center py-2.5 border-b-[1.5px] border-black">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button className="flex-1 flex justify-center py-2.5 text-gray-400">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-px bg-gray-100">
          {gridPosts.map((post) => {
            const isPublished = publishedSlugs.has(post.slug);
            return (
              <Link
                key={post.slug}
                href={`/dashboard/instagram/${post.slug}`}
                className="relative bg-white block hover:opacity-90 transition-opacity cursor-pointer" style={{ aspectRatio: "4/5" }}
              >
                <Image
                  src={post.image}
                  alt={post.topic}
                  fill
                  className="object-cover"
                  sizes="(max-width: 430px) 33vw, 143px"
                />
                {isPublished && (
                  <div className="absolute top-1.5 right-1.5 bg-green-500 rounded-full p-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
