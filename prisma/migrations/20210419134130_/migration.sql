/*
  Warnings:

  - You are about to drop the column `teaser` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "teaser",
ADD COLUMN     "teaser_text" TEXT NOT NULL DEFAULT E'';
