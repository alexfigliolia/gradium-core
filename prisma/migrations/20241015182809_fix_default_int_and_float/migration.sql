-- AlterTable
ALTER TABLE "Amenity" ALTER COLUMN "footage" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "LivingSpace" ALTER COLUMN "beds" SET DEFAULT 0,
ALTER COLUMN "baths" SET DEFAULT 0,
ALTER COLUMN "footage" SET DEFAULT 0;