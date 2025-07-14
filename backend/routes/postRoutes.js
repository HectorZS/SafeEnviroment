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

// Search query

router.get('/posts/search/:query/:urgency/:category/:distance/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const title = req.params.query
    const urgency = req.params.urgency
    const category = req.params.category
    let distance = req.params.distance
    const distanceMap = new Map()
    let urgencyBool = true
    let categoryBool = true
    let titleBool = true
    let distanceBool = true
    if (!title || !urgency || !category || !distance) {
        return res.status(400).json({ error: 'Missing query parameter'})
    }
    try {
        if(urgency === "nourgency") {
            urgencyBool = false
        }
        if(category === "nocategory") {
            categoryBool = false
        }
        if(title === "notitle") {
            titleBool = false 
        }
        if(distance === 'nodistance'){
            distanceBool = false
        }

        if(!distanceBool) {
            distance = 10000
        }

        const distanceNum = parseFloat(distance)
        const nearbyUsers = await prisma.distances.findMany({
            where: {
                OR: [
                    {
                        userA_id: userId, 
                        distance: { lte: distanceNum }
                    },
                    {
                        userB_id: userId, 
                        distance: { lte: distanceNum}
                    }
                ]
            }
        })

        nearbyUsersIds = nearbyUsers.map(dist => {
            return dist.userA_id === userId ? dist.userB_id : dist.userA_id
        })

        nearbyUsers.forEach(dist => {
            const otherUserId = dist.userA_id === userId ? dist.userB_id : dist.userA_id
            distanceMap.set(otherUserId, dist.distance)
        })

        if(nearbyUsersIds === 0) {
            return res.json([])
        }

        const posts = await prisma.post.findMany({
            where: {
                creator: { 
                    user_id: {not: userId, 
                    ...(distanceBool ? { in: nearbyUsersIds }: {})
                    }
                }, 
                title: titleBool ? {contains: title} : {}, 
                urgency: urgencyBool ? {contains: urgency} : {}, 
                category: categoryBool ? {contains: category} : {}, 
                status: {
                    not: "completed"
                }
            },
            include: {creator: true},
            orderBy: {
                created_at: 'desc',
            }, 
            take: 10,
        })

        const postsWithDistance =  posts.map(post => ({
            ...post, 
            distance: distanceMap.get(post.creator.user_id) || null
        }))

        postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        res.json(postsWithDistance)
    } catch (error) {
        console.error("Error searching posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }   
})

// FILTER QUERY

router.get('/posts/filterby/:query/:category/:distance/:userId', async (req, res) => {
    const urgency = req.params.query
    const category = req.params.category
    let distance = req.params.distance
    const userId = parseInt(req.params.userId)
    const distanceMap = new Map()
    let urgencyBool = true
    let categoryBool = true
    let distanceBool = true
    if (!urgency) {
        return res.status(400).json({ error: 'Missing query parameter'})
    }
    try {
        if(urgency === "nourgency") {
            urgencyBool = false
        }
        if(category === "nocategory") {
            categoryBool = false
        }
        if(distance === "nodistance"){
            distanceBool = false
        }

        let nearbyUsersIds = []
        if(!distanceBool) {
            distance = 10000
        }

        const distanceNum = parseFloat(distance)
        const nearbyUsers = await prisma.distances.findMany({
            where: {
                OR: [
                    {
                        userA_id: userId, 
                        distance: { lte: distanceNum }
                    }, 
                    {
                        userB_id: userId, 
                        distance: { lte: distanceNum }
                    }
                ]
            }
        })

        nearbyUsersIds = nearbyUsers.map(dist => {
            return dist.userA_id === userId ? dist.userB_id : dist.userA_id
        })

        nearbyUsers.forEach(dist => {
            const otherUserId = dist.userA_id === userId ? dist.userB_id : dist.userA_id
            distanceMap.set(otherUserId, dist.distance)
        })

        if(nearbyUsersIds === 0) {
            return res.json([])
        }

        const where = {
            creator: {
                user_id: {
                    not: userId, 
                    ...(distanceBool ? { in: nearbyUsersIds }: {})
                }
            },
            ...(urgencyBool ? { urgency: { contains: urgency } } : {}),
            ...(categoryBool ? { category: {contains: category} }: {}), 
            status: {
                not: "completed"
            }
        };
        const posts = await prisma.post.findMany({
            where,
            include: {creator: true},
            orderBy: {
                created_at: 'desc',
            }, 
        })

        const postsWithDistance =  posts.map(post => ({
            ...post, 
            distance: distanceMap.get(post.creator.user_id) || null
        }))

        postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))

        res.json(postsWithDistance)
    } catch (error) {
        console.error("Error filtering posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }
})


// OWN POSTS QUERY

router.get('/user/posts', async (req, res) => {
    try {
        const userId = parseInt(req.session.user.user_id); 
        const posts = await prisma.post.findMany({
            where: {
                creator_id: userId
            },  
            include: {creator: true},
            orderBy: {
                created_at: 'desc',
            }, 
        }); 
        res.json(posts)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

// HOMEPAGE POSTS

router.get('/homepage/posts', async (req, res) => {
    try {
        const userId = parseInt(req.session.user.user_id); 
        const homepagePosts = await prisma.post.findMany({
            where: {
                creator_id: {
                    not: userId
                },
                status: {
                    not: "completed"
                }
            },
            include: {creator: true}, 
            orderBy: {
                created_at: 'desc',
            }, 
        });

        const distances = await prisma.distances.findMany({
            where: {
                OR: [
                    { userA_id: userId }, 
                    { userB_id: userId }
                ]
            }
        })

        const distanceMap = new Map()
        distances.forEach(distance => {
            const otherUserId = distance.userA_id === userId ? distance.userB_id : distance.userA_id
            distanceMap.set(otherUserId, distance.distance)
        })

        const postsWithDistance = homepagePosts.map(post => ({
            ...post, 
            distance: distanceMap.get(post.creator.user_id) ?? null
        }))

        postsWithDistance.sort((a, b) => {
            const aDist = a.distance ?? Infinity
            const bDist = b.distance ?? Infinity
            return aDist - bDist
        })
        res.json(postsWithDistance)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

// SEARCH USERS
router.get('/users/search/:query', async (req, res) => {
    try {
        const query = req.params.query
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, not: req.session.user.username } }, 
                    { email: { contains: query, not: req.session.user.email} }
                ]
            }, 
            select: {
                user_id: true, 
                username: true, 
                email: true
            }, 
            take: 5
        })
        res.json(users)
    } catch (error) {
        console.error("Error searching users: ", error)
        res.status(500).json({ error: "Server error" })
    }
})

// UPDATE STATUS OF POSTS
router.put('/posts/:id/complete', isAuthenticated, async (req, res) => {
    try {
        const postId = parseInt(req.params.id)
        const { volunteer_id } = req.body

        const post = await prisma.post.findUnique({
            where: {post_id: postId}
        })

        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        const updatedPost = await prisma.post.update({
            where: {post_id: postId}, 
            data: {
                status: "completed", 
                volunteer_id: volunteer_id
            }, 
            include: {
                creator: true,
                volunteer: true
            }
        })
        res.json(updatedPost)
    } catch (error) {
        console.error("Error updating post status: ", error)
        res.status(500).json({ error: "Failed to update post status" })
    }
})

// CREATE POST

router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const { title, category, description, urgency, status, volunteer_id } = req.body
        const creator_id = req.session.user.user_id
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
