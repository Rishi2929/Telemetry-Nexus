/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_publicId_key" ON "ApiKey"("publicId");
