-- AlterTable
ALTER TABLE "OTRequest" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'OPEN';
