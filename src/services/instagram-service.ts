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

// Meta marca como temporales los errores de servidor con `is_transient: true`
// (típicamente code 1 y 2: "An unexpected error has occurred. Please retry...").
// Son fallos del lado de Meta que suelen resolverse en segundos; reintentar salva
// al cron diario de baches puntuales. Los errores definitivos (token, permisos,
// validación de media, rate limit) NO se reintentan: se propagan de inmediato.
function isTransientMetaError(data: {
  error?: { code?: number; is_transient?: boolean };
}): boolean {
  const err = data?.error;
  if (!err) return false;
  return err.is_transient === true || err.code === 1 || err.code === 2;
}

const MAX_POST_ATTEMPTS = 4; // 1 intento + 3 reintentos ante errores transitorios

// POST a la Graph API. Inyecta el access_token y devuelve el JSON ya parseado.
//
// `retryTransient` activa reintento exponencial (2s, 4s, 8s) ante errores
// temporales de Meta. SOLO debe usarse en operaciones idempotentes: crear un
// container es seguro de reintentar (a lo sumo deja un container huérfano que
// Meta expira solo), pero `media_publish` NO es idempotente — si Meta ya procesó
// la publicación y devuelve igual un error transitorio, reintentar duplicaría el
// post. Por eso el publish va en un único intento; su reintento lo maneja el cron
// vía estado PENDING (ver publishDuePublications en scheduling-service).
async function graphPost(
  pathSuffix: string,
  body: Record<string, unknown>,
  fallbackError: string,
  { retryTransient = false }: { retryTransient?: boolean } = {}
): Promise<{ id: string }> {
  const { accessToken } = getConfig();
  const maxAttempts = retryTransient ? MAX_POST_ATTEMPTS : 1;
  let lastError = fallbackError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(`${GRAPH_API_BASE}/${pathSuffix}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, access_token: accessToken }),
    });

    const data = await res.json();
    if (res.ok) return data;

    lastError = data.error?.message || fallbackError;
    const isLastAttempt = attempt === maxAttempts;
    if (!isTransientMetaError(data) || isLastAttempt) {
      throw new Error(lastError);
    }

    const delayMs = 2000 * 2 ** (attempt - 1); // 2s, 4s, 8s
    console.warn(
      `[Instagram] error transitorio de Meta (code ${data.error?.code}), ` +
        `reintento ${attempt}/${maxAttempts - 1} en ${delayMs}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(lastError);
}

async function createMediaContainer(
  body: Record<string, unknown>
): Promise<string> {
  const { userId } = getConfig();
  // Idempotente: reintentamos ante baches transitorios de Meta (donde más fallan).
  const data = await graphPost(
    `${userId}/media`,
    body,
    "Error al crear el container de media en Instagram",
    { retryTransient: true }
  );
  return data.id;
}

async function publishMediaContainer(creationId: string): Promise<string> {
  const { userId } = getConfig();
  // Un solo intento a propósito: media_publish no es idempotente (ver graphPost).
  const data = await graphPost(
    `${userId}/media_publish`,
    { creation_id: creationId },
    "Error al publicar en Instagram"
  );
  return data.id;
}

// Mapeo de mensajes técnicos de la Graph API a textos accionables en español.
// Si ningún patrón matchea, se devuelve el mensaje original como fallback.
function humanizeInstagramError(rawMessage: string, label: string): string {
  const m = rawMessage.toLowerCase()

  if (m.includes("audio") && m.includes("codec")) {
    return `El audio del ${label} no es compatible con Instagram. Tiene que ser AAC.`
  }
  if (m.includes("duration") || m.includes("too long") || m.includes("too short")) {
    return `Duración inválida — los Reels deben durar entre 3 y 90 segundos.`
  }
  if (m.includes("aspect ratio") || m.includes("dimensions")) {
    return `Aspect ratio del ${label} inválido. Reels esperan 9:16 (vertical).`
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return `Llegaste al límite de Instagram (100 publicaciones cada 24h).`
  }
  if (m.includes("not available") || m.includes("download") || m.includes("fetch")) {
    return `Instagram no pudo descargar el ${label}. Verificá que la URL sea pública.`
  }
  if (m.includes("9004") || m.includes("9006") || m.includes("unknown")) {
    return `Instagram rechazó el ${label} con un error genérico. Probá regenerar la pieza.`
  }
  if (m.includes("expired")) {
    return `El container del ${label} expiró antes de publicarse. Volvé a intentar.`
  }
  // Fallback: dejar el mensaje original (recortado) para no perder info.
  const trimmed = rawMessage.slice(0, 180)
  return `Instagram rechazó el ${label}: ${trimmed}`
}

type WaitOptions = {
  // Total de intentos antes de tirar timeout. Default conservador para imagen.
  maxAttempts?: number
  // Delay en ms entre intentos.
  delayMs?: number
  // Etiqueta usada en el mensaje de error (imagen | video).
  mediaLabel?: string
}

async function waitForMediaReady(
  containerId: string,
  opts: WaitOptions = {}
): Promise<void> {
  const { accessToken } = getConfig();
  const maxAttempts = opts.maxAttempts ?? 10;
  const delayMs = opts.delayMs ?? 2000;
  const label = opts.mediaLabel ?? "imagen";

  for (let i = 0; i < maxAttempts; i++) {
    // Pedimos también `status` (descripción detallada) además de `status_code`
    // para poder propagar el motivo real cuando Instagram rechaza.
    const res = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code,status&access_token=${accessToken}`
    );
    const data = await res.json();

    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      console.error("[Instagram] container error:", JSON.stringify(data));
      const raw = data.status || `Instagram rechazó el ${label}`;
      throw new Error(humanizeInstagramError(raw, label));
    }
    if (data.status_code === "EXPIRED") {
      throw new Error(`El container del ${label} expiró antes de publicarse. Volvé a intentar.`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Timeout esperando que Instagram procese el ${label}`);
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

/**
 * Publica una imagen en Instagram vía Graph API.
 * Encapsula el flujo createContainer → wait → publish.
 * Usado tanto por publicación inmediata como por el cron de scheduled.
 */
export async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<string> {
  const creationId = await createMediaContainer({
    image_url: imageUrl,
    caption,
  });
  await waitForMediaReady(creationId, { mediaLabel: "imagen" });
  return await publishMediaContainer(creationId);
}

/**
 * Publica un Reel en Instagram vía Graph API. share_to_feed=true para que
 * aparezca también en el feed regular además de la sección Reels.
 *
 * El procesamiento de video tarda más que el de imagen (~30-90s); por eso
 * el wait usa maxAttempts más altos y delay más largo.
 */
export async function publishReelToInstagram(
  videoUrl: string,
  caption: string,
  opts: { coverUrl?: string } = {}
): Promise<string> {
  const creationId = await createMediaContainer({
    media_type: "REELS",
    video_url: videoUrl,
    caption,
    share_to_feed: true,
    ...(opts.coverUrl ? { cover_url: opts.coverUrl } : {}),
  });
  await waitForMediaReady(creationId, {
    maxAttempts: 60,
    delayMs: 3000,
    mediaLabel: "video",
  });
  return await publishMediaContainer(creationId);
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
  // Branch por tipo de media: video → Reel (con thumbnail como cover),
  // sino imagen estática.
  const igMediaId = piece.videoUrl
    ? await publishReelToInstagram(piece.videoUrl, fullCaption, {
        coverUrl: piece.imageUrl,
      })
    : await publishToInstagram(piece.imageUrl, fullCaption);

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
