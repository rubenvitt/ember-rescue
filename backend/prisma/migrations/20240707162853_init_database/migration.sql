-- CreateTable
CREATE TABLE "bearbeiter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bearbeiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einheiten" (
    "id" TEXT NOT NULL,
    "funkrufname" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "kapazitaet" INTEGER NOT NULL,
    "istTemporaer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aktuellerStatusId" TEXT,

    CONSTRAINT "einheiten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einheitenStatusHistorie" (
    "id" TEXT NOT NULL,
    "zeitpunkt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einheitId" TEXT,
    "statusId" TEXT,
    "bearbeiterId" TEXT,
    "einsatzId" TEXT,

    CONSTRAINT "einheitenStatusHistorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einsaetze" (
    "id" TEXT NOT NULL,
    "beginn" TIMESTAMP(3) NOT NULL,
    "ende" TIMESTAMP(3),
    "abgeschlossen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bearbeiterId" TEXT,
    "aufnehmendesRettungsmittelId" TEXT NOT NULL,

    CONSTRAINT "einsaetze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einheitenOnEinsaetze" (
    "id" TEXT NOT NULL,
    "einsatzbeginn" TIMESTAMP(3) NOT NULL,
    "einsatzende" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einsatzId" TEXT,
    "einheitId" TEXT,

    CONSTRAINT "einheitenOnEinsaetze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personenOnEinsaetze" (
    "id" TEXT NOT NULL,
    "fahrzeugfuehrer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einsatzEinheitId" TEXT,
    "personId" TEXT,

    CONSTRAINT "personenOnEinsaetze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einsatztagebuchEintraege" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "absender" TEXT NOT NULL,
    "empfaenger" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einsatzId" TEXT,
    "bearbeiterId" TEXT,

    CONSTRAINT "einsatztagebuchEintraege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "telefonnummer" TEXT NOT NULL,
    "fuehrungskraft" BOOLEAN NOT NULL,
    "istTemporaer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personenOnQualifikationen" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personId" TEXT,
    "qualifikationId" TEXT,

    CONSTRAINT "personenOnQualifikationen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualifikationen" (
    "id" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "abkuerzung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qualifikationen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einsatzOnAlarmstichworte" (
    "id" TEXT NOT NULL,
    "einsatzId" TEXT NOT NULL,
    "alarmstichwortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "einsatzOnAlarmstichworte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alarmstichworte" (
    "id" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alarmstichworte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secrets" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bearbeiter_name_key" ON "bearbeiter"("name");

-- CreateIndex
CREATE INDEX "einsatztagebuchEintraege_absender_idx" ON "einsatztagebuchEintraege"("absender");

-- CreateIndex
CREATE INDEX "einsatztagebuchEintraege_empfaenger_idx" ON "einsatztagebuchEintraege"("empfaenger");

-- CreateIndex
CREATE INDEX "einsatztagebuchEintraege_type_idx" ON "einsatztagebuchEintraege"("type");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_key_key" ON "secrets"("key");

-- AddForeignKey
ALTER TABLE "einheiten" ADD CONSTRAINT "einheiten_aktuellerStatusId_fkey" FOREIGN KEY ("aktuellerStatusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenStatusHistorie" ADD CONSTRAINT "einheitenStatusHistorie_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "bearbeiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenStatusHistorie" ADD CONSTRAINT "einheitenStatusHistorie_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenStatusHistorie" ADD CONSTRAINT "einheitenStatusHistorie_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenStatusHistorie" ADD CONSTRAINT "einheitenStatusHistorie_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "einheiten"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsaetze" ADD CONSTRAINT "einsaetze_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "bearbeiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsaetze" ADD CONSTRAINT "einsaetze_aufnehmendesRettungsmittelId_fkey" FOREIGN KEY ("aufnehmendesRettungsmittelId") REFERENCES "einheiten"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenOnEinsaetze" ADD CONSTRAINT "einheitenOnEinsaetze_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "einheiten"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einheitenOnEinsaetze" ADD CONSTRAINT "einheitenOnEinsaetze_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personenOnEinsaetze" ADD CONSTRAINT "personenOnEinsaetze_personId_fkey" FOREIGN KEY ("personId") REFERENCES "personen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personenOnEinsaetze" ADD CONSTRAINT "personenOnEinsaetze_einsatzEinheitId_fkey" FOREIGN KEY ("einsatzEinheitId") REFERENCES "einheitenOnEinsaetze"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsatztagebuchEintraege" ADD CONSTRAINT "einsatztagebuchEintraege_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsatztagebuchEintraege" ADD CONSTRAINT "einsatztagebuchEintraege_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "bearbeiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personenOnQualifikationen" ADD CONSTRAINT "personenOnQualifikationen_qualifikationId_fkey" FOREIGN KEY ("qualifikationId") REFERENCES "qualifikationen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personenOnQualifikationen" ADD CONSTRAINT "personenOnQualifikationen_personId_fkey" FOREIGN KEY ("personId") REFERENCES "personen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsatzOnAlarmstichworte" ADD CONSTRAINT "einsatzOnAlarmstichworte_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "einsaetze"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einsatzOnAlarmstichworte" ADD CONSTRAINT "einsatzOnAlarmstichworte_alarmstichwortId_fkey" FOREIGN KEY ("alarmstichwortId") REFERENCES "alarmstichworte"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
