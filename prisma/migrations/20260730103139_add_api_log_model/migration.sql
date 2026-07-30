/*
  Warnings:

  - You are about to drop the column `timestamp` on the `ApiLog` table. All the data in the column will be lost.
  - You are about to alter the column `latency` on the `ApiLog` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `level` to the `ApiLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `ApiLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');

-- DropIndex
DROP INDEX "ApiLog_projectId_idx";

-- DropIndex
DROP INDEX "ApiLog_timestamp_idx";

-- AlterTable
ALTER TABLE "ApiLog" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "level" "LogLevel" NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "latency" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "ApiLog_projectId_createdAt_idx" ON "ApiLog"("projectId", "createdAt");
