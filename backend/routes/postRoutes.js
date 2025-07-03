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


router.get('/posts/search/:query', async (req, res) => {
    console.log("here")
    const title = req.params.query
    if (!title) {
        return res.status(400).json({ error: 'Missing query parameter'})
    }
    try {
        const posts = await prisma.post.findMany({
            where: {
                // creator_id: {
                //     not: req.session.user.user_id
                // },
                title: {
                    contains: title, 
                    // mode: 'insensitive', 
                },
            }, 
            orderBy: {
                created_at: 'desc',
            }, 
            take: 10,
        })
        res.json(posts);
        console.log(posts)
    } catch (error) {
        console.error("Error searching posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }
})


router.get('/user/posts', async (req, res) => {
    try {
        const userId = parseInt(req.session.user.user_id); 
        const posts = await prisma.post.findMany({
            where: {
                creator_id: userId
            },  
            include: {creator: true}
        }); 
        res.json(posts)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

router.get('/homepage/posts', async (req, res) => {
    try {
        const userId = parseInt(req.session.user.user_id); 
        const homepagePosts = await prisma.post.findMany({
            where: {
                creator_id: {
                    not: userId
                }
            },
            include: {creator: true}
        });
        res.json(homepagePosts)
    } catch (error) {
        res.status(500).send('Server error')
    }
})


router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const { title, category, description, urgency, status, volunteer_id } = req.body
        console.log("HERER")
        const creator_id = req.session.user.user_id
        console.log(creator_id)
        const newPost = await prisma.post.create({
            data: {
            title, 
            category, 
            description, 
            urgency, 
            status, 
            creator_id: creator_id,
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
