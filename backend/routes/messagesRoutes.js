const express = require('express')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const isAuthenticated = require('./postRoutes.js')
const prisma = new PrismaClient()
const router = express.Router()


router.post('/chatrooms/:id/messages', isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body
        const chat_id = parseInt(req.params.id)
        const sender = req.session.user.user_id
        const newMessage = await prisma.message.create({
            data: {
                chat_id: chat_id, 
                sender_id: sender,
                content
            }
        })
        res.status(201).json(newMessage)
    } catch(error) {
        res.status(500).json({ error: "Something went wrong while creating the post." });
    }
})

router.put('/chatrooms/:chatId/mark-as-viewed', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const chatId = parseInt(req.params.chatId);

        await prisma.message.updateMany({
            where: {
                chat_id: chatId,
                sender_id: {
                    not: userId
                },
                viewed: false
            },
            data: {
                viewed: true
            }
        });

        res.status(200).json({ message: "Messages marked as viewed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error marking messages as viewed" });
    }
});



module.exports = router
