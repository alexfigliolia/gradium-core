/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,name]` on the table `LivingSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Amenity" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "open" SET DEFAULT '9am',
ALTER COLUMN "close" SET DEFAULT '9pm',
ALTER COLUMN "billed" SET DEFAULT 'hour';

-- CreateIndex
CREATE UNIQUE INDEX "LivingSpace_propertyId_name_key" ON "LivingSpace"("propertyId", "name");
