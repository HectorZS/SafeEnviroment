/*
  Warnings:

  - Added the required column `creator_username` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "creator_username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creator_username_fkey" FOREIGN KEY ("creator_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
