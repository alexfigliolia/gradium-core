/*
  Warnings:

  - You are about to drop the `PropertyFloorPlan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `LivingSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PropertyAddonType" AS ENUM ('packageManagement', 'amenityReservations', 'propertyEvents', 'leaseManagement', 'hoaManagement');

-- DropForeignKey
ALTER TABLE "PropertyFloorPlan" DROP CONSTRAINT "PropertyFloorPlan_propertyId_fkey";

-- DropIndex
DROP INDEX "Property_slug_key";

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "address1" SET DEFAULT '',
ALTER COLUMN "address2" SET DEFAULT '',
ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "state" SET DEFAULT '',
ALTER COLUMN "zipCode" SET DEFAULT '';

-- DropTable
DROP TABLE "PropertyFloorPlan";

-- CreateTable
CREATE TABLE "PropertyAddon" (
    "id" SERIAL NOT NULL,
    "type" "PropertyAddonType" NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyAddon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAddon_id_key" ON "PropertyAddon"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LivingSpace_name_key" ON "LivingSpace"("name");

-- AddForeignKey
ALTER TABLE "PropertyAddon" ADD CONSTRAINT "PropertyAddon_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
