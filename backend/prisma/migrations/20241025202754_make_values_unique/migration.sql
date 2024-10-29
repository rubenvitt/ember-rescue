/*
  Warnings:

  - The `optaOrdnung` column on the `fahrzeuge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[label]` on the table `fahrzeuge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[optaOrtId,optaFunktionId,optaOrdnung]` on the table `fahrzeuge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "fahrzeuge"
    DROP COLUMN "optaOrdnung",
    ADD COLUMN "optaOrdnung" INTEGER;


UPDATE "fahrzeuge"
SET "optaOrdnung" = 1;

-- CreateIndex
CREATE UNIQUE INDEX "fahrzeuge_label_key" ON "fahrzeuge" ("label");

-- CreateIndex
CREATE UNIQUE INDEX "fahrzeuge_optaOrtId_optaFunktionId_optaOrdnung_key" ON "fahrzeuge" ("optaOrtId", "optaFunktionId", "optaOrdnung");


-- Add constraint to ensure either "label" is set or the combination of 
-- "optaOrtId", "optaFunktionId", and "optaOrdnung" is set
ALTER TABLE "fahrzeuge"
    ADD CONSTRAINT "fahrzeuge_label_or_opta_combo_check"
        CHECK (
            "label" IS NOT NULL
                OR ("optaOrtId" IS NOT NULL AND "optaFunktionId" IS NOT NULL AND "optaOrdnung" IS NOT NULL)
            );
