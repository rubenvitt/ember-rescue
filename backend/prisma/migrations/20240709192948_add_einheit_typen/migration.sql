-- CreateTable
CREATE TABLE "EinheitOnEinheitTyp" (
    "id" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "fachaufgabe" TEXT NOT NULL,
    "verwaltungsstufe" TEXT NOT NULL,
    "einheitId" TEXT NOT NULL,
    "einheitTypId" TEXT NOT NULL,

    CONSTRAINT "EinheitOnEinheitTyp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinheitTyp" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "grundzeichen" TEXT NOT NULL,

    CONSTRAINT "EinheitTyp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EinheitOnEinheitTyp_einheitId_einheitTypId_key" ON "EinheitOnEinheitTyp"("einheitId", "einheitTypId");

-- AddForeignKey
ALTER TABLE "EinheitOnEinheitTyp" ADD CONSTRAINT "EinheitOnEinheitTyp_einheitId_fkey" FOREIGN KEY ("einheitId") REFERENCES "einheiten"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinheitOnEinheitTyp" ADD CONSTRAINT "EinheitOnEinheitTyp_einheitTypId_fkey" FOREIGN KEY ("einheitTypId") REFERENCES "EinheitTyp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
