-- AlterTable
ALTER TABLE "OTRequest" ADD COLUMN     "closedById" TEXT,
ADD COLUMN     "startedById" TEXT;

-- AddForeignKey
ALTER TABLE "OTRequest" ADD CONSTRAINT "OTRequest_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTRequest" ADD CONSTRAINT "OTRequest_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
