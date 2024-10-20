-- DropForeignKey
ALTER TABLE "einsaetze"
    DROP CONSTRAINT "einsaetze_id_fkey";

-- AddForeignKey
ALTER TABLE "einsatzMeta"
    ADD CONSTRAINT "einsatzMeta_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
