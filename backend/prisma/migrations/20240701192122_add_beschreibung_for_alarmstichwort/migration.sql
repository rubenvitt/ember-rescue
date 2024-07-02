/*
  Warnings:

  - Added the required column `beschreibung` to the `Alarmstichwort` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarmstichwort"
    ADD COLUMN "beschreibung" TEXT NULL;

-- Then update the new column, setting all rows to ''
UPDATE "Alarmstichwort"
SET "beschreibung" = '';

-- Finally, alter the new column to NOT NULL
ALTER TABLE "Alarmstichwort"
    ALTER COLUMN "beschreibung" SET NOT NULL;

