"use server";

import { revalidatePath } from "next/cache";
import { getPostBySlug } from "@/lib/instagram-posts";
import { publishPost } from "@/services/instagram-service";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function publishPostAction(
  slug: string
): Promise<ActionResult<{ igMediaId: string; publishedAt: string }>> {
  try {
    const post = getPostBySlug(slug);
    if (!post) {
      return { success: false, error: "Post no encontrado" };
    }

    const imageUrl = post.blobUrl;
    const caption = `${post.caption}\n\n${post.hashtags.join(" ")}`;

    const result = await publishPost(slug, imageUrl, caption);

    revalidatePath("/dashboard/instagram");
    revalidatePath(`/dashboard/instagram/${slug}`);

    return {
      success: true,
      data: { igMediaId: result.igMediaId, publishedAt: result.publishedAt.toISOString() },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al publicar" };
  }
}
