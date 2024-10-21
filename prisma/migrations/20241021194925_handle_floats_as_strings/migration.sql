/*
  Warnings:

  - You are about to drop the column `footage` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `footage` on the `LivingSpace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "footage",
ADD COLUMN     "size" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "LivingSpace" DROP COLUMN "footage",
ADD COLUMN     "size" TEXT NOT NULL DEFAULT '0';
