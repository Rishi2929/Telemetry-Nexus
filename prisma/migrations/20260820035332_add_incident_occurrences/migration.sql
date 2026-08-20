-- CreateTable
CREATE TABLE "IncidentOccurrence" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "apiLogId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "Latency" DOUBLE PRECISION NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IncidentOccurrence_incidentId_idx" ON "IncidentOccurrence"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentOccurrence_endpoint_idx" ON "IncidentOccurrence"("endpoint");

-- CreateIndex
CREATE INDEX "IncidentOccurrence_occurredAt_idx" ON "IncidentOccurrence"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentOccurrence_incidentId_apiLogId_key" ON "IncidentOccurrence"("incidentId", "apiLogId");

-- AddForeignKey
ALTER TABLE "IncidentOccurrence" ADD CONSTRAINT "IncidentOccurrence_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentOccurrence" ADD CONSTRAINT "IncidentOccurrence_apiLogId_fkey" FOREIGN KEY ("apiLogId") REFERENCES "ApiLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
