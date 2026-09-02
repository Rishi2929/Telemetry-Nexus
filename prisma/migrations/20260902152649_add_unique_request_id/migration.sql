/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `ApiLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApiLog_requestId_key" ON "ApiLog"("requestId");
