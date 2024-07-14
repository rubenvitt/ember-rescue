/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "status_code_key" ON "status"("code");

-- CreateIndex
CREATE INDEX "status_code_idx" ON "status"("code");
