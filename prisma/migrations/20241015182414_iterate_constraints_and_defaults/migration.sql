/*
  Warnings:

  - The `footage` column on the `Amenity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `footage` column on the `LivingSpace` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "LivingSpace_name_key";

-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "footage",
ADD COLUMN     "footage" DOUBLE PRECISION NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE "LivingSpace" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "type" SET DEFAULT 'unit',
ALTER COLUMN "beds" SET DEFAULT -1,
ALTER COLUMN "baths" SET DEFAULT -1,
DROP COLUMN "footage",
ADD COLUMN     "footage" DOUBLE PRECISION NOT NULL DEFAULT -1;
