-- CreateTable
CREATE TABLE "InstagramPublish" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "igMediaId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstagramPublish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramPublish_slug_key" ON "InstagramPublish"("slug");
