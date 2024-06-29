-- CreateTable
CREATE TABLE "Bearbeiter"
(
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "active"    BOOLEAN      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bearbeiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Einheit"
(
    "id"                TEXT         NOT NULL,
    "funkrufname"       TEXT         NOT NULL,
    "typ"               TEXT         NOT NULL,
    "kapazitaet"        INTEGER      NOT NULL,
    "istTemporaer"      BOOLEAN      NOT NULL,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    "aktuellerStatusId" TEXT,

    CONSTRAINT "Einheit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinheitStatusHistorie"
(
    "id"           TEXT         NOT NULL,
    "zeitpunkt"    TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "einheitId"    TEXT,
    "statusId"     TEXT,
    "bearbeiterId" TEXT,
    "einsatzId"    TEXT,

    CONSTRAINT "EinheitStatusHistorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Einsatz"
(
    "id"           TEXT         NOT NULL,
    "beginn"       TIMESTAMP(3) NOT NULL,
    "ende"         TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "bearbeiterId" TEXT,

    CONSTRAINT "Einsatz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinsatzEinheit"
(
    "id"            TEXT         NOT NULL,
    "einsatzbeginn" TIMESTAMP(3) NOT NULL,
    "einsatzende"   TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "einsatzId"     TEXT,
    "einheitId"     TEXT,

    CONSTRAINT "EinsatzEinheit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinsatzEinheitPerson"
(
    "id"               TEXT         NOT NULL,
    "fahrzeugfuehrer"  BOOLEAN      NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    "einsatzEinheitId" TEXT,
    "personId"         TEXT,

    CONSTRAINT "EinsatzEinheitPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinsatztagebuchEintrag"
(
    "id"           TEXT         NOT NULL,
    "timestamp"    TIMESTAMP(3) NOT NULL,
    "type"         TEXT         NOT NULL,
    "content"      TEXT         NOT NULL,
    "absender"     TEXT         NOT NULL,
    "empfaenger"   TEXT         NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "einsatzId"    TEXT,
    "bearbeiterId" TEXT,

    CONSTRAINT "EinsatztagebuchEintrag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person"
(
    "id"             TEXT         NOT NULL,
    "name"           TEXT         NOT NULL,
    "telefonnummer"  TEXT         NOT NULL,
    "fuehrungskraft" BOOLEAN      NOT NULL,
    "istTemporaer"   BOOLEAN      NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonQualifikation"
(
    "id"              TEXT         NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "personId"        TEXT,
    "qualifikationId" TEXT,

    CONSTRAINT "PersonQualifikation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualifikation"
(
    "id"          TEXT         NOT NULL,
    "bezeichnung" TEXT         NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qualifikation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status"
(
    "id"           TEXT         NOT NULL,
    "bezeichnung"  TEXT         NOT NULL,
    "beschreibung" TEXT         NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bearbeiter_name_key" ON "Bearbeiter" ("name");

-- CreateIndex
CREATE INDEX "EinsatztagebuchEintrag_absender_idx" ON "EinsatztagebuchEintrag" ("absender");

-- CreateIndex
CREATE INDEX "EinsatztagebuchEintrag_empfaenger_idx" ON "EinsatztagebuchEintrag" ("empfaenger");

-- CreateIndex
CREATE INDEX "EinsatztagebuchEintrag_type_idx" ON "EinsatztagebuchEintrag" ("type");

-- AddForeignKey
ALTER TABLE "Einheit"
    ADD CONSTRAINT "Einheit_aktuellerStatusId_fkey" FOREIGN KEY ("aktuellerStatusId") REFERENCES "Status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinheitStatusHistorie"
    ADD CONSTRAINT "EinheitStatusHistorie_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "Bearbeiter" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinheitStatusHistorie"
    ADD CONSTRAINT "EinheitStatusHistorie_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinheitStatusHistorie"
    ADD CONSTRAINT "EinheitStatusHistorie_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "Einsatz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinheitStatusHistorie"
    ADD CONSTRAINT "EinheitStatusHistorie_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "Einheit" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Einsatz"
    ADD CONSTRAINT "Einsatz_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "Bearbeiter" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzEinheit"
    ADD CONSTRAINT "EinsatzEinheit_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "Einheit" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzEinheit"
    ADD CONSTRAINT "EinsatzEinheit_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "Einsatz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzEinheitPerson"
    ADD CONSTRAINT "EinsatzEinheitPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzEinheitPerson"
    ADD CONSTRAINT "EinsatzEinheitPerson_einsatzEinheitId_fkey" FOREIGN KEY ("einsatzEinheitId") REFERENCES "EinsatzEinheit" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatztagebuchEintrag"
    ADD CONSTRAINT "EinsatztagebuchEintrag_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "Einsatz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatztagebuchEintrag"
    ADD CONSTRAINT "EinsatztagebuchEintrag_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "Bearbeiter" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonQualifikation"
    ADD CONSTRAINT "PersonQualifikation_qualifikationId_fkey" FOREIGN KEY ("qualifikationId") REFERENCES "Qualifikation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonQualifikation"
    ADD CONSTRAINT "PersonQualifikation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Einfügen der offiziellen Status-Codes mit angepassten Beschreibungen
INSERT INTO "Status" ("id", "bezeichnung", "beschreibung", "createdAt", "updatedAt")
VALUES ('1', 'Einsatzbereit auf Funk', 'Einheit ist verfügbar und kann über Funk für neue Einsätze angefordert werden',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('2', 'Einsatzbereit auf Wache / Standort',
        'Einheit befindet sich einsatzbereit auf der Wache oder am zugewiesenen Standort', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('3', 'Einsatzübernahme (ausgerückt)',
        'Einheit hat einen Einsatz übernommen und befindet sich auf dem Weg zum Einsatzort', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('4', 'Einsatzort (vor Ort)', 'Einheit ist am Einsatzort eingetroffen und führt den Einsatz durch',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('5', 'Sprechwunsch', 'Einheit wünscht Kontakt zur Leitstelle für nicht dringende Kommunikation',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('6', 'Nicht einsatzbereit / außer Dienst',
        'Einheit ist vorübergehend nicht verfügbar oder außer Dienst gestellt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('7', 'Einsatzgebunden',
        'Rettungsdiensteinheit ist in einem laufenden Einsatz gebunden, z.B. während der Patientenversorgung',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('8', 'Bedingt verfügbar / am Zielort',
        'Rettungsdiensteinheit ist am Zielort (z.B. Krankenhaus) und könnte bedingt für neue Einsätze verfügbar sein',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('9', 'Quittung / Datenabfrage (nur besondere Fahrzeuge)',
        'Spezialeinheit führt Datenabfrage durch oder quittiert einen Auftrag, gilt nur für bestimmte Fahrzeuge',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('0', 'Priorisierter Sprechwunsch',
        'Einheit benötigt dringend Kontakt zur Leitstelle, hat Priorität vor normalen Sprechwünschen',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);