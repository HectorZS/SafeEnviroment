-- CreateTable
CREATE TABLE "Distances" (
    "id" SERIAL NOT NULL,
    "userA_id" INTEGER NOT NULL,
    "userB_id" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Distances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Distances_userA_id_userB_id_key" ON "Distances"("userA_id", "userB_id");

-- AddForeignKey
ALTER TABLE "Distances" ADD CONSTRAINT "Distances_userA_id_fkey" FOREIGN KEY ("userA_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distances" ADD CONSTRAINT "Distances_userB_id_fkey" FOREIGN KEY ("userB_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
