-- CreateEnum
CREATE TYPE "PersonRole" AS ENUM ('owner', 'manager', 'maintenance', 'resident');

-- CreateEnum
CREATE TYPE "LivingSpaceType" AS ENUM ('unit', 'dwelling');

-- CreateEnum
CREATE TYPE "BillFrequency" AS ENUM ('hour', 'day');

-- CreateEnum
CREATE TYPE "RentPaymentFrequency" AS ENUM ('day', 'month', 'year');

-- CreateEnum
CREATE TYPE "LeaseStatus" AS ENUM ('complete', 'inProgress', 'terminated', 'pending');

-- CreateTable
CREATE TABLE "MaintenaceImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "maintenanceItemId" INTEGER NOT NULL,

    CONSTRAINT "MaintenaceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceAssignment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "personId" INTEGER NOT NULL,
    "maintenanceItemId" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentPayment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "leaseId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "RentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lease" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "LeaseStatus" NOT NULL,
    "paymentFrequency" "RentPaymentFrequency" NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "livingSpaceId" INTEGER NOT NULL,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmenityReservation" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "amenityId" INTEGER NOT NULL,
    "livingSpaceId" INTEGER NOT NULL,

    CONSTRAINT "AmenityReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmenityFloorPlan" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "amenityId" INTEGER NOT NULL,

    CONSTRAINT "AmenityFloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmenityImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "amenityId" INTEGER NOT NULL,

    CONSTRAINT "AmenityImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "open" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "footage" TEXT NOT NULL DEFAULT '',
    "billed" "BillFrequency" NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingSpaceImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "livingSpaceId" INTEGER NOT NULL,

    CONSTRAINT "LivingSpaceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingSpaceFloorPlan" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "livingSpaceId" INTEGER NOT NULL,

    CONSTRAINT "LivingSpaceFloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingSpace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LivingSpaceType" NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" DOUBLE PRECISION NOT NULL,
    "footage" TEXT NOT NULL DEFAULT '',
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "LivingSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyFloorPlan" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyFloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "mapsLink" TEXT NOT NULL DEFAULT '',
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" "PersonRole" NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LeaseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MaintenaceImage_id_key" ON "MaintenaceImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceAssignment_id_key" ON "MaintenanceAssignment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceItem_id_key" ON "MaintenanceItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_id_key" ON "RentPayment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Lease_id_key" ON "Lease"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AmenityReservation_id_key" ON "AmenityReservation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AmenityFloorPlan_id_key" ON "AmenityFloorPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AmenityImage_id_key" ON "AmenityImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_id_key" ON "Amenity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LivingSpaceImage_id_key" ON "LivingSpaceImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LivingSpaceFloorPlan_id_key" ON "LivingSpaceFloorPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LivingSpace_id_key" ON "LivingSpace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyImage_id_key" ON "PropertyImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFloorPlan_id_key" ON "PropertyFloorPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_id_key" ON "Property"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Person_id_key" ON "Person"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_key" ON "Organization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LeaseToUser_AB_unique" ON "_LeaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LeaseToUser_B_index" ON "_LeaseToUser"("B");

-- AddForeignKey
ALTER TABLE "MaintenaceImage" ADD CONSTRAINT "MaintenaceImage_maintenanceItemId_fkey" FOREIGN KEY ("maintenanceItemId") REFERENCES "MaintenanceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAssignment" ADD CONSTRAINT "MaintenanceAssignment_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAssignment" ADD CONSTRAINT "MaintenanceAssignment_maintenanceItemId_fkey" FOREIGN KEY ("maintenanceItemId") REFERENCES "MaintenanceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceItem" ADD CONSTRAINT "MaintenanceItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceItem" ADD CONSTRAINT "MaintenanceItem_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentPayment" ADD CONSTRAINT "RentPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentPayment" ADD CONSTRAINT "RentPayment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentPayment" ADD CONSTRAINT "RentPayment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityReservation" ADD CONSTRAINT "AmenityReservation_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityReservation" ADD CONSTRAINT "AmenityReservation_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityFloorPlan" ADD CONSTRAINT "AmenityFloorPlan_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityImage" ADD CONSTRAINT "AmenityImage_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingSpaceImage" ADD CONSTRAINT "LivingSpaceImage_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingSpaceFloorPlan" ADD CONSTRAINT "LivingSpaceFloorPlan_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingSpace" ADD CONSTRAINT "LivingSpace_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFloorPlan" ADD CONSTRAINT "PropertyFloorPlan_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeaseToUser" ADD CONSTRAINT "_LeaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeaseToUser" ADD CONSTRAINT "_LeaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
