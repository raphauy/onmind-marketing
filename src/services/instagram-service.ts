import { prisma } from "@/lib/prisma";
import type { InstagramPublish } from "@prisma/client";

const GRAPH_API_BASE = "https://graph.instagram.com/v22.0";

function getConfig() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!accessToken || !userId) {
    throw new Error("Faltan variables de entorno: INSTAGRAM_ACCESS_TOKEN o INSTAGRAM_USER_ID");
  }
  return { accessToken, userId };
}

// --- DB ---

export async function getPublishedPosts(): Promise<InstagramPublish[]> {
  return prisma.instagramPublish.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishStatus(slug: string): Promise<InstagramPublish | null> {
  return prisma.instagramPublish.findUnique({
    where: { slug },
  });
}

// --- Instagram Graph API ---

async function createMediaContainer(imageUrl: string, caption: string): Promise<string> {
  const { accessToken, userId } = getConfig();

  console.log("[Instagram] Creando container:", { imageUrl, captionLength: caption.length });

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[Instagram] Error creando container:", JSON.stringify(data.error));
    throw new Error(data.error?.message || "Error al crear el container de media en Instagram");
  }

  console.log("[Instagram] Container creado:", data.id);
  return data.id;
}

async function publishMediaContainer(creationId: string): Promise<string> {
  const { accessToken, userId } = getConfig();

  console.log("[Instagram] Publicando container:", creationId);

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
    console.error("[Instagram] Error publicando:", JSON.stringify(data.error));
    throw new Error(data.error?.message || "Error al publicar en Instagram");
  }

  console.log("[Instagram] Publicado con media ID:", data.id);
  return data.id;
}

async function waitForMediaReady(containerId: string, maxAttempts = 10): Promise<void> {
  const { accessToken } = getConfig();

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();

    console.log(`[Instagram] Status check ${i + 1}/${maxAttempts}:`, data.status_code);

    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      console.error("[Instagram] Container rechazado:", JSON.stringify(data));
      throw new Error("Instagram rechazó la imagen");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Timeout esperando que Instagram procese la imagen");
}

// --- Orquestación ---

export async function publishPost(slug: string, imageUrl: string, caption: string): Promise<InstagramPublish> {
  const existing = await getPublishStatus(slug);
  if (existing) {
    throw new Error("Este post ya fue publicado");
  }

  const creationId = await createMediaContainer(imageUrl, caption);
  await waitForMediaReady(creationId);
  const igMediaId = await publishMediaContainer(creationId);

  return prisma.instagramPublish.create({
    data: {
      slug,
      igMediaId,
    },
  });
}
