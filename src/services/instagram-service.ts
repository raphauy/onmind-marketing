import { prisma } from "@/lib/prisma";

const GRAPH_API_BASE = "https://graph.instagram.com/v22.0";

function getConfig() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!accessToken || !userId) {
    throw new Error("Faltan variables de entorno: INSTAGRAM_ACCESS_TOKEN o INSTAGRAM_USER_ID");
  }
  return { accessToken, userId };
}

// --- Profile ---

export type InstagramProfile = {
  username: string;
  name: string;
  biography: string;
  profilePictureUrl: string;
  website: string | null;
  followers: number;
  follows: number;
  mediaCount: number;
};

export async function getProfile(): Promise<InstagramProfile> {
  const { accessToken, userId } = getConfig();

  const res = await fetch(
    `${GRAPH_API_BASE}/${userId}?fields=username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website&access_token=${accessToken}`
  );
  const data = await res.json();

  if (!res.ok) {
    console.error("[Instagram] Error obteniendo perfil:", JSON.stringify(data.error));
    throw new Error(data.error?.message || "Error al obtener perfil de Instagram");
  }

  return {
    username: data.username,
    name: data.name,
    biography: data.biography,
    profilePictureUrl: data.profile_picture_url,
    website: data.website || null,
    followers: data.followers_count,
    follows: data.follows_count,
    mediaCount: data.media_count,
  };
}

// --- Instagram Graph API ---

async function createMediaContainer(imageUrl: string, caption: string): Promise<string> {
  const { accessToken, userId } = getConfig();

  console.log("[IG-DEBUG] createMediaContainer — imageUrl:", imageUrl);
  console.log("[IG-DEBUG] createMediaContainer — caption length:", caption.length);
  console.log("[IG-DEBUG] createMediaContainer — userId:", userId);

  // Probe de la imageUrl: lo mismo que va a hacer Instagram al fetchearla.
  try {
    const head = await fetch(imageUrl, { method: "HEAD", redirect: "follow" });
    console.log(
      "[IG-DEBUG] HEAD imageUrl — status:", head.status,
      "content-type:", head.headers.get("content-type"),
      "content-length:", head.headers.get("content-length"),
      "final-url:", head.url,
    );
  } catch (e) {
    console.log("[IG-DEBUG] HEAD imageUrl falló:", (e as Error).message);
  }

  const body = {
    image_url: imageUrl,
    caption,
    media_type: "IMAGE",
    access_token: accessToken,
  };
  console.log("[IG-DEBUG] POST /media body keys:", Object.keys(body));

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log("[IG-DEBUG] POST /media — status:", res.status, "response:", JSON.stringify(data));

  if (!res.ok) {
    throw new Error(data.error?.message || "Error al crear el container de media en Instagram");
  }

  return data.id;
}

async function publishMediaContainer(creationId: string): Promise<string> {
  const { accessToken, userId } = getConfig();

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Error al publicar en Instagram");
  }

  return data.id;
}

async function waitForMediaReady(containerId: string, maxAttempts = 10): Promise<void> {
  const { accessToken } = getConfig();

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();

    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      throw new Error("Instagram rechazó la imagen");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Timeout esperando que Instagram procese la imagen");
}

// --- Helpers reutilizables ---

export function buildFullCaption(piece: {
  caption: string | null
  topic: string | null
  hashtags: string[]
}): string {
  return [
    piece.caption || piece.topic || "",
    piece.hashtags.length > 0 ? "\n\n" + piece.hashtags.join(" ") : "",
  ].join("");
}

// URL pública por la cual Meta baja la imagen. No usamos piece.imageUrl directo
// (Blob de Vercel) porque el fetcher de Instagram lo rechaza con 9004/2207052.
// El endpoint /api/piezas/[slug]/image proxea los bytes desde nuestro dominio.
export function buildPublicImageUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL
  if (!base) {
    throw new Error("Falta NEXT_PUBLIC_APP_URL para publicar en Instagram")
  }
  return `${base.replace(/\/$/, "")}/api/piezas/${slug}/image`
}

/**
 * Publica una imagen en Instagram vía Graph API.
 * Encapsula el flujo createContainer → wait → publish.
 * Usado tanto por publicación inmediata como por el cron de scheduled.
 */
export async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<string> {
  console.log("[IG-DEBUG] publishToInstagram — start");
  const creationId = await createMediaContainer(imageUrl, caption);
  console.log("[IG-DEBUG] publishToInstagram — creationId:", creationId);
  await waitForMediaReady(creationId);
  console.log("[IG-DEBUG] publishToInstagram — container ready, publishing");
  const igMediaId = await publishMediaContainer(creationId);
  console.log("[IG-DEBUG] publishToInstagram — published igMediaId:", igMediaId);
  return igMediaId;
}

// --- Publicar una Piece ---

export async function publishPiece(pieceId: string) {
  const piece = await prisma.piece.findUniqueOrThrow({
    where: { id: pieceId },
    include: { publications: { where: { platform: "instagram" } } },
  });

  if (!piece.imageUrl) {
    throw new Error("La pieza no tiene imagen generada");
  }

  if (piece.publications.some((p) => p.status === "PUBLISHED")) {
    throw new Error("Esta pieza ya fue publicada en Instagram");
  }

  const fullCaption = buildFullCaption(piece);
  const publicImageUrl = buildPublicImageUrl(piece.slug);
  const igMediaId = await publishToInstagram(publicImageUrl, fullCaption);

  const publication = await prisma.publication.create({
    data: {
      pieceId: piece.id,
      platform: "instagram",
      platformId: igMediaId,
      publishedAt: new Date(),
      status: "PUBLISHED",
    },
  });

  await prisma.piece.update({
    where: { id: piece.id },
    data: { status: "PUBLISHED" },
  });

  return publication;
}
