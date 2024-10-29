/*
  Warnings:

  - You are about to drop the column `fahrzeugTypId` on the `fahrzeuge` table. All the data in the column will be lost.
  - You are about to drop the column `funkrufname` on the `fahrzeuge` table. All the data in the column will be lost.
  - You are about to drop the `fahrzeugTyp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `optaFunktionId` to the `fahrzeuge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optaOrtId` to the `fahrzeuge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fahrzeuge"
    DROP CONSTRAINT "fahrzeuge_fahrzeugTypId_fkey";

-- AlterTable
ALTER TABLE "fahrzeuge"
    ADD COLUMN "label"          TEXT,
    ADD COLUMN "optaFunktionId" INTEGER,
    ADD COLUMN "optaOrdnung"    TEXT,
    ADD COLUMN "optaOrtId"      INTEGER;


-- Update `label` column with values from `funkrufname` before dropping the column
UPDATE "fahrzeuge"
SET "label" = "funkrufname";


UPDATE "fahrzeuge"
SET "optaOrtId"      = matches[1]::INTEGER,
    "optaOrdnung"    = matches[2],
    "optaFunktionId" = matches[3]::INTEGER
FROM (SELECT id, REGEXP_MATCHES("funkrufname", '^(\d+)-(\d+)-(\d+)$') AS matches
      FROM "fahrzeuge") AS subquery
WHERE "fahrzeuge".id = subquery.id;

ALTER TABLE "fahrzeuge"
    DROP COLUMN "fahrzeugTypId",
    DROP COLUMN "funkrufname";

-- DropTable
DROP TABLE "fahrzeugTyp";

-- AddForeignKey
ALTER TABLE "fahrzeuge"
    ADD CONSTRAINT "fahrzeuge_optaOrtId_fkey" FOREIGN KEY ("optaOrtId") REFERENCES "optaOrt" ("optaCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fahrzeuge"
    ADD CONSTRAINT "fahrzeuge_optaFunktionId_fkey" FOREIGN KEY ("optaFunktionId") REFERENCES "optaFunktion" ("optaCode") ON DELETE CASCADE ON UPDATE CASCADE;
