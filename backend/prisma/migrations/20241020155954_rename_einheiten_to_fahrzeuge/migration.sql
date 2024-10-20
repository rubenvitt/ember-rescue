-- Umbenennen der Tabellen
ALTER TABLE "EinheitTyp"
    RENAME TO "FahrzeugTyp";
ALTER TABLE "einheiten"
    RENAME TO "fahrzeuge";
ALTER TABLE "einheitenOnEinsaetze"
    RENAME TO "fahrzeugOnEinsaetze";
ALTER TABLE "einheitenStatusHistorie"
    RENAME TO "fahrzeugStatusHistorie";

-- Anpassen der Spalten in umbenannten Tabellen
ALTER TABLE "fahrzeuge"
    RENAME COLUMN "einheitTypId" TO "fahrzeugTypId";
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME COLUMN "einheitId" TO "fahrzeugId";
ALTER TABLE "fahrzeugOnEinsaetze"
    RENAME COLUMN "einheitId" TO "fahrzeugId";

-- Umbenennen der Fremdschlüssel
ALTER TABLE "fahrzeuge"
    RENAME CONSTRAINT "einheiten_aktuellerStatusId_fkey" TO "fahrzeuge_aktuellerStatusId_fkey";
ALTER TABLE "fahrzeuge"
    RENAME CONSTRAINT "einheiten_einheitTypId_fkey" TO "fahrzeuge_fahrzeugTypId_fkey";
ALTER TABLE "fahrzeugOnEinsaetze"
    RENAME CONSTRAINT "einheitenOnEinsaetze_einheitId_fkey" TO "fahrzeugOnEinsaetze_fahrzeugId_fkey";
ALTER TABLE "fahrzeugOnEinsaetze"
    RENAME CONSTRAINT "einheitenOnEinsaetze_einsatzId_fkey" TO "fahrzeugOnEinsaetze_einsatzId_fkey";
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME CONSTRAINT "einheitenStatusHistorie_bearbeiterId_fkey" TO "fahrzeugStatusHistorie_bearbeiterId_fkey";
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME CONSTRAINT "einheitenStatusHistorie_einheitId_fkey" TO "fahrzeugStatusHistorie_fahrzeugId_fkey";
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME CONSTRAINT "einheitenStatusHistorie_einsatzId_fkey" TO "fahrzeugStatusHistorie_einsatzId_fkey";
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME CONSTRAINT "einheitenStatusHistorie_statusId_fkey" TO "fahrzeugStatusHistorie_statusId_fkey";

-- Anpassen der Fremdschlüssel in anderen Tabellen
ALTER TABLE "einsaetze"
    RENAME CONSTRAINT "einsaetze_aufnehmendesRettungsmittelId_fkey" TO "einsaetze_aufnehmendesRettungsmittelId_fkey_new";
ALTER TABLE "einsaetze"
    DROP CONSTRAINT "einsaetze_aufnehmendesRettungsmittelId_fkey_new";
ALTER TABLE "einsaetze"
    ADD CONSTRAINT "einsaetze_aufnehmendesRettungsmittelId_fkey" FOREIGN KEY ("aufnehmendesRettungsmittelId") REFERENCES "fahrzeuge" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Anpassen der personenOnEinsaetze Tabelle
ALTER TABLE "personenOnEinsaetze"
    DROP CONSTRAINT IF EXISTS "personenOnEinsaetze_einsatzEinheitId_fkey";
ALTER TABLE "personenOnEinsaetze"
    DROP COLUMN IF EXISTS "einsatzEinheitId";
ALTER TABLE "personenOnEinsaetze"
    ADD COLUMN IF NOT EXISTS "einsatzFahrzeugId" TEXT;
ALTER TABLE "personenOnEinsaetze"
    ADD CONSTRAINT "personenOnEinsaetze_einsatzFahrzeugId_fkey" FOREIGN KEY ("einsatzFahrzeugId") REFERENCES "fahrzeugOnEinsaetze" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Anpassen der FahrzeugTyp Tabelle (ehemals EinheitTyp)
ALTER TABLE "FahrzeugTyp"
    ADD COLUMN IF NOT EXISTS "grundzeichen" TEXT;

-- Anpassen des Unique Index für fahrzeugOnEinsaetze
DROP INDEX IF EXISTS "einheitenOnEinsaetze_einsatzId_einheitId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "fahrzeugOnEinsaetze_einsatzId_fahrzeugId_key" ON "fahrzeugOnEinsaetze" ("einsatzId", "fahrzeugId");

-- AlterTable
ALTER TABLE "FahrzeugTyp"
    RENAME CONSTRAINT "EinheitTyp_pkey" TO "FahrzeugTyp_pkey";

-- AlterTable
ALTER TABLE "fahrzeugOnEinsaetze"
    RENAME CONSTRAINT "einheitenOnEinsaetze_pkey" TO "fahrzeugOnEinsaetze_pkey";

-- AlterTable
ALTER TABLE "fahrzeugStatusHistorie"
    RENAME CONSTRAINT "einheitenStatusHistorie_pkey" TO "fahrzeugStatusHistorie_pkey";

-- AlterTable
ALTER TABLE "fahrzeuge"
    RENAME CONSTRAINT "einheiten_pkey" TO "fahrzeuge_pkey";