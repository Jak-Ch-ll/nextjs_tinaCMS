/*
  Warnings:

  - You are about to drop the column `published` on the `article` table. All the data in the column will be lost.
  - Made the column `auto_url` on table `article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `img_title` on table `article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "published",
ALTER COLUMN "auto_url" SET NOT NULL,
ALTER COLUMN "img_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "verification_request" ALTER COLUMN "updated_at" DROP DEFAULT;
