/*
  Warnings:

  - You are about to drop the column `attachments` on the `OTRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OTRequest" DROP COLUMN "attachments";

-- CreateTable
CREATE TABLE "OTAttachment" (
    "id" TEXT NOT NULL,
    "otId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OTAttachment" ADD CONSTRAINT "OTAttachment_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OTRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
