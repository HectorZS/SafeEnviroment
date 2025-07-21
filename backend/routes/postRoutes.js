const express = require('express')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const recommendationScore = require('../utils/recommendationScore')
const prisma = new PrismaClient()
const router = express.Router()
const haversine = require('../utils/haversine')

const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in to perform this action." });
    }
    next();
};

// search query with both TC's
router.get('/posts/search/:query/:urgency/:category/:distance/:userId/:location/:types/:postsMode', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const title = req.params.query
    const urgency = req.params.urgency
    const category = req.params.category
    const location = req.params.location
    const types = req.params.types
    const postsMode = req.params.postsMode
    let urgencyBool = true
    let categoryBool = true
    let titleBool = true
    let locationBool = true
    let postsWithScore, postsWithDistance, helpedPosts, helpedCategories, times
    if (!title || !urgency || !category) {
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
        if(location === 'nolocation') {
            locationBool = false
        }
        if(postsMode === 'recomendedMode') {
            helpedPosts = await prisma.post.findMany({
                where: {
                    volunteer_id: userId
                }, 
                select: {
                    category: true
                }
            })
            helpedCategories = new Set(helpedPosts.map(post => post.category))
            times = new Map()
            helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
            })
        }
        if(locationBool){
            // state
            if(types.includes("administrative_area_level_1")){
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                administrativeArea: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                administrativeArea: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            }
            else if(types.includes("locality")){
                // city
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                locality: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                locality: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            } else if(types.includes("route")){
                // route
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                route: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                route: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            }
            else {
                // street address
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        address: { contains : location}
                    }
            }
        } else {
            where = {
                    user_id: {
                        not: userId, 
                    }
            };
        }

        const allUsers = await prisma.user.findMany({
            where,
            select: {
                user_id: true, 
            }
        })

        const allUsersIds = allUsers.map(user => user.user_id)
        const posts = await prisma.post.findMany({
            where: {
                creator: { 
                    user_id: {
                        not: userId, 
                        in: allUsersIds
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

            if(postsMode === 'recomendedMode'){
            postsWithScore = posts.map(post => {
                const distance = distanceMap.get(post.creator.user_id) ?? 9999
                const score = recommendationScore(post, helpedCategories, distance, times)
                return {...post, distance, score }
            })
            postsWithScore.sort((a, b) => b.score - a.score)
        } else {
            postsWithDistance =  posts.map(post => ({
                ...post, 
                distance: distanceMap.get(post.creator.user_id) || null
            }))
            postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        }
        
        res.json(postsMode === 'recomendedMode' ? postsWithScore : postsWithDistance)
    } catch (error) {
        console.error("Error searching posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }   
})

// Filter with both TC's
router.get('/posts/filterby/:query/:category/:distance/:userId/:location/:types/:postsMode', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const urgency = req.params.query
    const category = req.params.category
    const location = req.params.location
    const types = String(req.params.types)
    const postsMode = req.params.postsMode
    let urgencyBool = true
    let categoryBool = true
    let locationBool = true
    let where, postsWithScore, postsWithDistance, helpedPosts, helpedCategories, times
    try {
        if(urgency === "nourgency") {
            urgencyBool = false
        }
        if(category === "nocategory") {
            categoryBool = false
        }
        if(location === 'nolocation'){
            locationBool = false
        }
        if(postsMode === 'recomendedMode') {
            helpedPosts = await prisma.post.findMany({
                where: {
                    volunteer_id: userId
                }, 
                select: {
                    category: true
                }
            })
            helpedCategories = new Set(helpedPosts.map(post => post.category))
            times = new Map()
            helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
            })
        }
        // state
        if(locationBool){
            if(types.includes("administrative_area_level_1")){
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                administrativeArea: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                administrativeArea: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            }
            else if(types.includes("locality")){
                // city
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                locality: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                locality: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            }
            else if(types.includes("route")){
                // route
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        OR: [
                            {
                                route: {
                                path: ['long_name'],
                                string_contains: location,
                                },
                            },
                            {
                                route: {
                                path: ['short_name'],
                                string_contains: location,
                                },
                            },
                        ],
                    }
            } else {
                // street address
                where = {
                        user_id: {
                            not: userId, 
                        }, 
                        address: { contains : location}
                    }
            }
        } else {
            where = {
                    user_id: {
                        not: userId, 
                    }
            };
        }

        const allUsers = await prisma.user.findMany({
            where,
            select: {
                user_id: true, 
            }
        })
        const allUsersIds = allUsers.map(user => user.user_id)
        const postsInArea = await prisma.post.findMany({
            where: {
            creator: {
                user_id: {
                    not: userId, 
                    in: allUsersIds,
                }
            }, 
            ...(urgencyBool ? { urgency: { contains: urgency } } : {}),
            ...(categoryBool ? { category: {contains: category} }: {}), 
            status: {
                not: "completed"
            }
            },
            include: {
                creator: true
            }, 
            orderBy: {
                created_at: 'desc'
            }
        })

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


         if(postsMode === 'recomendedMode'){
            postsWithScore = postsInArea.map(post => {
                const distance = distanceMap.get(post.creator.user_id) ?? 9999
                const score = recommendationScore(post, helpedCategories, distance, times)
                return {...post, distance, score }
            })
            postsWithScore.sort((a, b) => b.score - a.score)
        } else {
            postsWithDistance =  postsInArea.map(post => ({
                ...post, 
                distance: distanceMap.get(post.creator.user_id) || null
            }))
            postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        }
       
        res.json(postsMode === 'recomendedMode' ? postsWithScore : postsWithDistance)

    } catch (error) {
        console.error("Error filtering posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }
})

// Search with recommended posts TC without Filtering by area TC

router.get('/posts/search/:query/:urgency/:category/:distance/:userId/:postsMode', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const title = req.params.query
    const urgency = req.params.urgency
    const category = req.params.category
    const postsMode = req.params.postsMode
    let distance = req.params.distance
    const distanceMap = new Map()
    let urgencyBool = true
    let categoryBool = true
    let titleBool = true
    let distanceBool = true
    let helpedPosts, helpedCategories, postsWithScore, postsWithDistance, times
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
        if(postsMode === 'recomendedMode') {
            helpedPosts = await prisma.post.findMany({
                where: {
                    volunteer_id: userId
                }, 
                select: {
                    category: true
                }
            })
            helpedCategories = new Set(helpedPosts.map(post => post.category))
            times = new Map()
            helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
            })
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

        if(postsMode === 'recomendedMode'){
            postsWithScore = posts.map(post => {
                const distance = distanceMap.get(post.creator.user_id) ?? 9999
                const score = recommendationScore(post, helpedCategories, distance, times)
                return {...post, distance, score }
            })
            postsWithScore.sort((a, b) => b.score - a.score)
        } else {
            postsWithDistance =  posts.map(post => ({
                ...post, 
                distance: distanceMap.get(post.creator.user_id) || null
            }))
            postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        }
       
        res.json(postsMode === 'recomendedMode' ? postsWithScore : postsWithDistance)
    } catch (error) {
        console.error("Error searching posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }   
})

// Filter query with recommended posts TC without filtering by area TC

router.get('/posts/filterby/:query/:category/:distance/:userId/:postsMode', async (req, res) => {
    const urgency = req.params.query
    const category = req.params.category
    const postsMode = req.params.postsMode
    let distance = req.params.distance
    const userId = parseInt(req.params.userId)
    const distanceMap = new Map()
    let urgencyBool = true
    let categoryBool = true
    let distanceBool = true
    let helpedPosts, helpedCategories, postsWithScore, postsWithDistance, times
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
        if(postsMode === 'recomendedMode') {
            helpedPosts = await prisma.post.findMany({
                where: {
                    volunteer_id: userId
                }, 
                select: {
                    category: true
                }
            })
            helpedCategories = new Set(helpedPosts.map(post => post.category))
            times = new Map()
            helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
            })
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

        if(postsMode === 'recomendedMode'){
            postsWithScore = posts.map(post => {
                const distance = distanceMap.get(post.creator.user_id) ?? 9999
                const score = recommendationScore(post, helpedCategories, distance, times)
                return {...post, distance, score }
            })
            postsWithScore.sort((a, b) => b.score - a.score)
        } else {
            postsWithDistance =  posts.map(post => ({
                ...post, 
                distance: distanceMap.get(post.creator.user_id) || null
            }))
            postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        }
        
        res.json(postsMode === 'recomendedMode' ? postsWithScore : postsWithDistance)
    } catch (error) {
        console.error("Error filtering posts: ", error); 
        res.status(500).json({ error: 'Server error' })
    }
})


// Own posts query

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

// Homepage posts

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

// Search users
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

// Update status of posts
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

// Recommended posts TC
router.get('/posts/recommended/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    try {
        const helpedPosts = await prisma.post.findMany({
            where: {
                volunteer_id: userId
            }, 
            select: {
                category: true
            }
        })
        const times = new Map()
        helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
        })
        const helpedCategories = new Set(helpedPosts.map(post => post.category))
        const distances = await prisma.distances.findMany({
            where: {
                OR: [
                    { userA_id: userId }, 
                    { userB_id: userId }
                ]
            }
        })
        const distanceMap = new Map()
        const nearbyUsersIds = new Set()
        distances.forEach(distance => {
            const otherUserId = distance.userA_id === userId ? distance.userB_id : distance.userA_id
            distanceMap.set(otherUserId, distance.distance)
            nearbyUsersIds.add(otherUserId)
        })

        const candidatePosts = await prisma.post.findMany({
            where: {
                creator_id: {
                    not: userId, 
                    in: [...nearbyUsersIds]
                }, 
                status: {
                    not: "completed"
                }
            }, 
            include: {
                creator: true
            }
        })

        const postsWithScore = candidatePosts.map(post => {
            const distance = distanceMap.get(post.creator.user_id) ?? 9999
            const score = recommendationScore(post, helpedCategories, distance, times)
            return {...post, distance, score }
        })

        postsWithScore.sort((a, b) => b.score - a.score)
        res.json(postsWithScore)
    } catch (error) {
        console.error("Error in recommendation: ", error)
        res.status(500).json({ error: "Server error"})
    }
})


// Create posts

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

// Delete posts
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
