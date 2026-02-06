-- AlterTable
ALTER TABLE "OTIntervenant" ADD COLUMN     "assignedById" TEXT;

-- AddForeignKey
ALTER TABLE "OTIntervenant" ADD CONSTRAINT "OTIntervenant_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
