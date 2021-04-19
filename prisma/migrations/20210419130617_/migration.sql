/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "publishedAt",
ADD COLUMN     "published_at" TIMESTAMP(3);
