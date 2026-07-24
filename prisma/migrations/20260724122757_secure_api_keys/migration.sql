/*
  Warnings:

  - You are about to drop the column `apiKey` on the `ApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[keyHash]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keyHash` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiKey_apiKey_key";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "apiKey",
ADD COLUMN     "keyHash" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Default';

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_projectId_active_idx" ON "ApiKey"("projectId", "active");
