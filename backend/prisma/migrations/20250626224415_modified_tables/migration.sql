/*
  Warnings:

  - You are about to drop the column `location_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reputation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Volunteer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteer_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "location_id",
DROP COLUMN "type",
DROP COLUMN "user_id",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "creator_id" INTEGER NOT NULL,
ADD COLUMN     "volunteer_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "Reputation";

-- DropTable
DROP TABLE "Volunteer";
