/*
  Warnings:

  - You are about to drop the column `fortlaufende_nummer` on the `einsaetze` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[einsatzId,fortlaufende_nummer]` on the table `einsatztagebuchEintraege` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fortlaufende_nummer` to the `einsatztagebuchEintraege` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notizen"
    DROP CONSTRAINT "notizen_einsatzId_fkey";

-- AlterTable
alter table "einsatztagebuchEintraege"
    add column fortlaufende_nummer integer;

-- CreateIndex
CREATE UNIQUE INDEX "einsatztagebuchEintraege_einsatzId_fortlaufende_nummer_key" ON "einsatztagebuchEintraege" ("einsatzId", fortlaufende_nummer);

-- AddForeignKey
ALTER TABLE "notizen"
    ADD CONSTRAINT "notizen_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;


CREATE OR REPLACE FUNCTION generate_fortlaufende_nummer() RETURNS TRIGGER AS
$$
BEGIN
    -- Setze die fortlaufendeNummer, indem die maximale vorhandene Nummer + 1 genommen wird
    NEW.fortlaufende_nummer := (SELECT COALESCE(MAX(e.fortlaufende_nummer), 0) + 1
                                FROM "einsatztagebuchEintraege" e
                                WHERE e."einsatzId" = NEW."einsatzId");
    RETURN NEW;
end;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_fortlaufende_nummer
    BEFORE INSERT
    ON "einsatztagebuchEintraege"
    FOR EACH ROW
EXECUTE FUNCTION generate_fortlaufende_nummer();
