/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,type]` on the table `PropertyAddon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PropertyAddon_propertyId_type_key" ON "PropertyAddon"("propertyId", "type");
