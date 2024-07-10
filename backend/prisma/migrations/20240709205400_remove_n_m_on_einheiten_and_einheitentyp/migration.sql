/*
  Warnings:

  - You are about to drop the column `typ` on the `einheiten` table. All the data in the column will be lost.
  - You are about to drop the `EinheitOnEinheitTyp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `einheitTypId` to the `einheiten` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EinheitOnEinheitTyp" DROP CONSTRAINT "EinheitOnEinheitTyp_einheitId_fkey";

-- DropForeignKey
ALTER TABLE "EinheitOnEinheitTyp" DROP CONSTRAINT "EinheitOnEinheitTyp_einheitTypId_fkey";

-- AlterTable
ALTER TABLE "einheiten" DROP COLUMN "typ",
ADD COLUMN     "einheitTypId" TEXT NOT NULL,
ADD COLUMN     "fachaufgabe" TEXT,
ADD COLUMN     "organisation" TEXT,
ADD COLUMN     "verwaltungsstufe" TEXT;

-- DropTable
DROP TABLE "EinheitOnEinheitTyp";

-- AddForeignKey
ALTER TABLE "einheiten" ADD CONSTRAINT "einheiten_einheitTypId_fkey" FOREIGN KEY ("einheitTypId") REFERENCES "EinheitTyp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
