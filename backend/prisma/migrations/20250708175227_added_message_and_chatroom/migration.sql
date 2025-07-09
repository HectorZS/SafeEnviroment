-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" SERIAL NOT NULL,
    "userOne_id" INTEGER NOT NULL,
    "userTwo_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userOne_id_userTwo_id_key" ON "Chat"("userOne_id", "userTwo_id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userOne_id_fkey" FOREIGN KEY ("userOne_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userTwo_id_fkey" FOREIGN KEY ("userTwo_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
