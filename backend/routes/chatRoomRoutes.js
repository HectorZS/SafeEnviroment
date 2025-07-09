const express = require('express')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const isAuthenticated = require('./postRoutes.js')
const prisma = new PrismaClient()
const router = express.Router()

// Get a particular chatroom from two users

router.get('/chatroom/:userOneId/chat/:userTwoId', isAuthenticated, async (req, res) => {
    try {
        const userOneId = parseInt(req.params.userOneId); 
        const userTwoId = parseInt(req.params.userTwoId)
        const chats = await prisma.chat.findMany({
            where: {
                 OR: [
                    {
                        userOne_id: userOneId,
                        userTwo_id: userTwoId
                    },
                    { 
                        userOne_id: userTwoId,
                        userTwo_id: userOneId 
                    },
                ],
            },  
            include: {
                userOne: true, 
                userTwo: true, 
                messages: true
            }
        }); 
        res.json(chats)
    } catch (error) {
        res.status(500).send("Server error")
    }
})

router.get('/chatrooms/:chatroomId', isAuthenticated, async (req, res) => {
    try {
        const chatroomId = parseInt(req.params.chatroomId);
        const chat = await prisma.chat.findMany({
            where: {
                chat_id: chatroomId,
            },
            include: {
                userOne: true,
                userTwo: true,
                messages: true,
            },
        });
        if (!chat) {
            return res.status(404).json({ error: "Chatroom not found" });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).send("Server error")
    }
})

// Get all the chatrooms of current user with the user id
router.get('/chatrooms/users/:userId', isAuthenticated, async (req, res) => {
    try {
        const user_id = parseInt(req.params.id); 
        const chats = await prisma.chat.findMany({
            where: {
                 OR: [
                    {
                        userOne: {
                            user_id
                        },
                    },
                    { userTwo: { user_id } },
                ],
            },  
            include: {
                userOne: true, 
                userTwo: true, 
                messages: true
            }
        }); 
        res.json(chats)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

// post a new chatroom
router.post('/chatroom', isAuthenticated, async (req, res) => {
    try {
        const { userOneId, userTwoId } = req.body
        const existingChat = await prisma.chat.findFirst({
            where: {
                OR: [
                { userOne_id: parseInt(userOneId), userTwo_id: parseInt(userTwoId) },
                { userOne_id: parseInt(userTwoId), userTwo_id: parseInt(userOneId) }
                ]
            }
        });
        if (existingChat) {
            res.status(200).json(existingChat);
        } else {
        const newChat = await prisma.chat.create({
            data: {
            userOne_id: parseInt(userOneId), 
            userTwo_id: parseInt(userTwoId)
            }
        })
        res.status(201).json(newChat)
        }
    } catch(error) {
        res.status(500).json({ error: "Something went wrong while creating the post." });
    }
})

module.exports = router
