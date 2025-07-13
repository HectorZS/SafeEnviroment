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

module.exports = router
