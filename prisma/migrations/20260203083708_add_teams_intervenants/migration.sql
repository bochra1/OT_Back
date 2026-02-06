/*
  Warnings:

  - You are about to drop the column `intervenant` on the `OTRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OTRequest" DROP COLUMN "intervenant";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTIntervenant" (
    "id" TEXT NOT NULL,
    "otId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTIntervenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "OTIntervenant_otId_idx" ON "OTIntervenant"("otId");

-- CreateIndex
CREATE INDEX "OTIntervenant_userId_idx" ON "OTIntervenant"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTIntervenant" ADD CONSTRAINT "OTIntervenant_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OTRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTIntervenant" ADD CONSTRAINT "OTIntervenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
