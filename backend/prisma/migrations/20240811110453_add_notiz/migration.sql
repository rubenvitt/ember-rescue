-- CreateTable
CREATE TABLE "notizen"
(
    "id"           TEXT         NOT NULL,
    "content"      TEXT         NOT NULL,
    "reminder"     TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bearbeiterId" TEXT         NOT NULL,

    CONSTRAINT "notizen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notizen"
    ADD CONSTRAINT "notizen_bearbeiterId_fkey" FOREIGN KEY ("bearbeiterId") REFERENCES "bearbeiter" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
