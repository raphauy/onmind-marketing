import { put, del } from "@vercel/blob";

export async function uploadInstagramImage(
  slug: string,
  buffer: Buffer
): Promise<string> {
  const { url } = await put(`instagram/${slug}.png`, buffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
  });
  return url;
}

export async function deleteInstagramImage(url: string): Promise<void> {
  await del(url);
}
