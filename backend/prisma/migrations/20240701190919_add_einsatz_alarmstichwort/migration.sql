/*
  Warnings:

  - You are about to drop the `EinsatzEinheit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EinsatzEinheitPerson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonQualifikation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EinsatzEinheit" DROP CONSTRAINT "EinsatzEinheit_einheitId_fkey";

-- DropForeignKey
ALTER TABLE "EinsatzEinheit" DROP CONSTRAINT "EinsatzEinheit_einsatzId_fkey";

-- DropForeignKey
ALTER TABLE "EinsatzEinheitPerson" DROP CONSTRAINT "EinsatzEinheitPerson_einsatzEinheitId_fkey";

-- DropForeignKey
ALTER TABLE "EinsatzEinheitPerson" DROP CONSTRAINT "EinsatzEinheitPerson_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonQualifikation" DROP CONSTRAINT "PersonQualifikation_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonQualifikation" DROP CONSTRAINT "PersonQualifikation_qualifikationId_fkey";

-- DropTable
DROP TABLE "EinsatzEinheit";

-- DropTable
DROP TABLE "EinsatzEinheitPerson";

-- DropTable
DROP TABLE "PersonQualifikation";

-- CreateTable
CREATE TABLE "EinheitOnEinsatz" (
    "id" TEXT NOT NULL,
    "einsatzbeginn" TIMESTAMP(3) NOT NULL,
    "einsatzende" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einsatzId" TEXT,
    "einheitId" TEXT,

    CONSTRAINT "EinheitOnEinsatz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOnEinheitOnEinsatz" (
    "id" TEXT NOT NULL,
    "fahrzeugfuehrer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "einsatzEinheitId" TEXT,
    "personId" TEXT,

    CONSTRAINT "PersonOnEinheitOnEinsatz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOnQualifikation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personId" TEXT,
    "qualifikationId" TEXT,

    CONSTRAINT "PersonOnQualifikation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinsatzOnAlarmstichwort" (
    "id" TEXT NOT NULL,
    "einsatzId" TEXT NOT NULL,
    "alarmstichwortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EinsatzOnAlarmstichwort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarmstichwort" (
    "id" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alarmstichwort_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EinheitOnEinsatz" ADD CONSTRAINT "EinheitOnEinsatz_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "Einheit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinheitOnEinsatz" ADD CONSTRAINT "EinheitOnEinsatz_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "Einsatz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonOnEinheitOnEinsatz" ADD CONSTRAINT "PersonOnEinheitOnEinsatz_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonOnEinheitOnEinsatz" ADD CONSTRAINT "PersonOnEinheitOnEinsatz_einsatzEinheitId_fkey" FOREIGN KEY ("einsatzEinheitId") REFERENCES "EinheitOnEinsatz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonOnQualifikation" ADD CONSTRAINT "PersonOnQualifikation_qualifikationId_fkey" FOREIGN KEY ("qualifikationId") REFERENCES "Qualifikation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonOnQualifikation" ADD CONSTRAINT "PersonOnQualifikation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzOnAlarmstichwort" ADD CONSTRAINT "EinsatzOnAlarmstichwort_einsatzId_fkey" FOREIGN KEY ("einsatzId") REFERENCES "Einsatz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EinsatzOnAlarmstichwort" ADD CONSTRAINT "EinsatzOnAlarmstichwort_alarmstichwortId_fkey" FOREIGN KEY ("alarmstichwortId") REFERENCES "Alarmstichwort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
