/*
  Warnings:

  - Added the required column `einsatzId` to the `notizen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notizen"
    ADD COLUMN "einsatzId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notizen"
    ADD CONSTRAINT "notizen_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
