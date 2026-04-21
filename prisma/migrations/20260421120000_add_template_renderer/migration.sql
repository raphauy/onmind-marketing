-- CreateEnum
CREATE TYPE "TemplateRenderer" AS ENUM ('LLM', 'SATORI');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN "renderer" "TemplateRenderer" NOT NULL DEFAULT 'LLM';
ALTER TABLE "Template" ALTER COLUMN "promptTemplate" DROP NOT NULL;
ALTER TABLE "Template" ALTER COLUMN "model" DROP NOT NULL;
