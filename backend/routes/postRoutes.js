const express = require('express')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const router = express.Router()

const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in to perform this action." });
    }
    next();
};

router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const { title, category, description, urgency, status, volunteer_id } = req.body
        const newPost = await prisma.post.create({
            data: {
            title, 
            category, 
            description, 
            urgency, 
            status, 
            creator_id: req.session.user.user_id, 
            volunteer_id
            }
        })
        res.status(201).json(newPost)
    } catch(error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Something went wrong while creating the post." });
    }
})

router.delete('/posts/:id', isAuthenticated, async (req, res) => {
    try {
        const postId = parseInt(req.params.id)
        const post = await prisma.post.findUnique({
            where: {post_id : postId}
        })
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.creator_id !== req.session.user.user_id){
            return res.status(403).json({ error: "You can only delete your own posts" })
        }
        const deletePost = await prisma.post.delete({
            where: { post_id: parseInt(postId) }
        })
        res.status(204).json({ message: `Deleted succesfully, ${req.session.user.username}`})
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" })
    }
})


module.exports = router
