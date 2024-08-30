/*
  Warnings:

  - Added the required column `einsatzId` to the `reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "bearbeiterId" TEXT,
ADD COLUMN     "einsatzId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "bearbeiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
