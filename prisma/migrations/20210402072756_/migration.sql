/*
  Warnings:

  - You are about to drop the column `preview_text` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "preview_text",
ADD COLUMN     "teaser" TEXT NOT NULL DEFAULT E'';
