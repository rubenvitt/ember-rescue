-- DropForeignKey
ALTER TABLE "fahrzeuge"
    DROP CONSTRAINT "fahrzeuge_fahrzeugTypId_fkey";

-- RenameTable
ALTER TABLE "FahrzeugTyp"
    RENAME TO "fahrzeugTyp";

ALTER TABLE "fahrzeugTyp"
    RENAME CONSTRAINT "FahrzeugTyp_pkey" TO "fahrzeugTyp_pkey";

-- CreateTable
CREATE TABLE "optaFunktion"
(
    "id"         TEXT    NOT NULL,
    "label"      TEXT    NOT NULL,
    "optaCode"   INTEGER NOT NULL,
    "categoryId" TEXT    NOT NULL,

    CONSTRAINT "optaFunktion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optaOrt"
(
    "id"         TEXT    NOT NULL,
    "label"      TEXT    NOT NULL,
    "optaCode"   INTEGER NOT NULL,
    "categoryId" TEXT    NOT NULL,

    CONSTRAINT "optaOrt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "optaFunktion_optaCode_key" ON "optaFunktion" ("optaCode");

-- CreateIndex
CREATE INDEX "optaFunktion_id_label_optaCode_categoryId_idx" ON "optaFunktion" ("id", "label", "optaCode", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "optaOrt_optaCode_key" ON "optaOrt" ("optaCode");

-- CreateIndex
CREATE INDEX "optaOrt_id_label_optaCode_categoryId_idx" ON "optaOrt" ("id", "label", "optaCode", "categoryId");

-- CreateTable
CREATE TABLE "optaCategory"
(
    "id"    TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "group" TEXT NOT NULL,

    CONSTRAINT "optaCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fahrzeuge"
    ADD CONSTRAINT "fahrzeuge_fahrzeugTypId_fkey" FOREIGN KEY ("fahrzeugTypId") REFERENCES "fahrzeugTyp" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optaFunktion"
    ADD CONSTRAINT "optaFunktion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "optaCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optaOrt"
    ADD CONSTRAINT "optaOrt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "optaCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
