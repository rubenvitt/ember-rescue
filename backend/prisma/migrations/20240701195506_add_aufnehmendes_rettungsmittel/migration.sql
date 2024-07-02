/*
  Warnings:

  - Added the required column `aufnehmendesRettungsmittelId` to the `Einsatz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Einsatz" ADD COLUMN     "aufnehmendesRettungsmittelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Einsatz" ADD CONSTRAINT "Einsatz_aufnehmendesRettungsmittelId_fkey" FOREIGN KEY ("aufnehmendesRettungsmittelId") REFERENCES "Einheit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
