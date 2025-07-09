-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
