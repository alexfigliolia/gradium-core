-- DropIndex
DROP INDEX "LivingSpace_propertyId_name_key";

-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LivingSpace" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
