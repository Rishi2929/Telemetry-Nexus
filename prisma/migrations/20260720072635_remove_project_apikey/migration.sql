/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Project` table. All the data in the column will be lost.
  - Added the required column `environment` to the `ApiLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `ApiLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `severity` on the `Incident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('PRODUCTION', 'STAGING', 'DEVELOPMENT');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- DropIndex
DROP INDEX "Project_apiKey_key";

-- AlterTable
ALTER TABLE "ApiLog" ADD COLUMN     "environment" "Environment" NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" "Method" NOT NULL;

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "resolvedAt" TIMESTAMP(3),
DROP COLUMN "severity",
ADD COLUMN     "severity" "Severity" NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "apiKey",
DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_apiKey_key" ON "ApiKey"("apiKey");

-- CreateIndex
CREATE INDEX "ApiKey_projectId_idx" ON "ApiKey"("projectId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
