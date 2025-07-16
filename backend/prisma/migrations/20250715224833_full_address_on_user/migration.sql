/*
  Warnings:

  - The `administrativeArea` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locality` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `route` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `streetNumber` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "administrativeArea",
ADD COLUMN     "administrativeArea" JSONB,
DROP COLUMN "locality",
ADD COLUMN     "locality" JSONB,
DROP COLUMN "route",
ADD COLUMN     "route" JSONB,
DROP COLUMN "streetNumber",
ADD COLUMN     "streetNumber" JSONB;
