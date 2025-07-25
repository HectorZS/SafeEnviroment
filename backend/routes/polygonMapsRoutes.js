const express = require('express')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const router = express.Router()
const recommendationScore = require('../utils/recommendationScore')

// get all the users in the selected polygon
router.get('/get-users/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    try {
        const users = await prisma.user.findMany({
            where: {
                user_id: {
                    not: userId
                }
            }
        }
        );
        res.json(users);
    } catch (error) {
        console.error("Error fetching volunteered posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// applying filters with the polygon mode
router.post('/posts/by-users', async (req, res) => {
    try {
        const userId = req?.session?.user?.user_id
        const {userIds, urgency, category, recommended, title} = req.body
        const ids = userIds.map(id => parseInt(id))
        let postsWithDistance, postsWithScore, helpedPosts, helpedCategories
        const where = {
            creator_id: {
                in: ids
            }, 
            status: 'pending', 
            inHelp: false, 
            title: title !== '' ? {
                contains: title, 
                mode: 'insensitive'
            } : {}
        }
        if (urgency && urgency !== 'nourgency') {
            where.urgency = urgency
        }
        if (category && category !== 'nocategory') {
            where.category = category
        }
        if(recommended === 'recomendedMode') {
            helpedPosts = await prisma.post.findMany({
                where: {
                    volunteer_id: userId
                }, 
                select: {
                    category: true, 
                    title: true, 
                    description: true
                }
            })
            helpedCategories = new Set(helpedPosts.map(post => post.category))
            times = new Map()
            helpedPosts.forEach(post => {
            times.set(post.category, (times.get(post.category) || 0) + 1)
            })
        }
        const posts = await prisma.post.findMany({
            where, 
            include: {
                creator: true
            }, 
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
       
        if(recommended === 'recomendedMode'){
            postsWithScore = [] // changed this code because i needed to handle the promises in order secuentially for the tc 2
            for (const post of posts) {
                const distance = distanceMap.get(post.creator.user_id) ?? 9999
                const score = await recommendationScore(post, helpedCategories, distance, times, helpedPosts, "search without location")
                postsWithScore.push({...post, distance, score})
            }
            postsWithScore.sort((a, b) => b.score - a.score)
        } else {
            postsWithDistance =  posts.map(post => ({
                ...post, 
                distance: distanceMap.get(post.creator.user_id) || null
            }))
            postsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        }
        res.json(recommended === 'recomendedMode' ? postsWithScore : postsWithDistance)
    } catch (error) {
        console.error("Error fetching posts in polygon: ", error)
        res.status(500).json({ error: "internal server error" })
    }
})

module.exports = router
