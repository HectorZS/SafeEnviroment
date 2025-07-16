const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const router = express.Router()
const getCoordsForAdressModule = require('./mapsRoutes.js');
const haversine = require('../utils/haversine')
const getCoordsForAdress = getCoordsForAdressModule.default;



router.post('/signup', async(req, res) => {
    let coordinates, lat, lng, streetNumber, route, locality, administrativeAreaLevel1
    try {
        const { email, username, password, address  } = req.body
        if (!username || !password || !email) {
            return res.status(400).json({error: "You left some field in blank, all the fields should be filled out"})
        }

        if (password.length < 8) {
            return res.status(400).json({error: "password should be more than 8 caracters"})
        }

        const existingEmail = await prisma.user.findUnique({
            where: {email}
        })
        if (existingEmail) {
            return res.status(400).json({error: "Email already registered"})
        }

        const existingUser = await prisma.user.findUnique({
            where: {username}
        })
        if (existingUser) {
            return res.status(400).json({error: "Username already exists"})
        }
        try {
        [coordinates, streetNumber, route, locality, administrativeAreaLevel1] = await getCoordsForAdress(address)
        
        } catch (error) {
            return res.status(500).json({error: "Invalid location"})
        }
        
        lat = coordinates.lat
        lng = coordinates.lng

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
               email, 
               username, 
               password: hashedPassword, 
               latitude: lat, 
               longitude: lng, 
               address,
               streetNumber: (streetNumber), 
               route: (route), 
               locality: (locality), 
               administrativeArea: (administrativeAreaLevel1)
            }
        })

        // take users that are not the new user
        const otherUsers = await prisma.user.findMany({
            where: {
                user_id: { not: newUser.user_id }, 
                latitude: { not: null }, 
                longitude: { not: null }
            }
        })

        // calculate distances
        const distances = otherUsers.map(otherUser => {
            const distance = haversine(
                parseFloat(newUser.latitude), 
                parseFloat(newUser.longitude), 
                parseFloat(otherUser.latitude), 
                parseFloat(otherUser.longitude)
            )

            return {
                userA_id: Math.min(newUser.user_id, otherUser.user_id), 
                userB_id: Math.max(newUser.user_id, otherUser.user_id), 
                distance
            }
        })

        // insert distances into the "distances" table
        await prisma.distances.createMany({
            data: distances, 
            skipDuplicates: true
        })


        req.session.user = newUser
        res.status(201).json({message: "Signup succesfull"})
    } catch (error) {
    console.error(error)
    res.status(500).json({error})
    }
})

router.post("/login", async(req, res) => {
    try {
        const { email, username, password } = req.body
        if (!username || !password || !email ) {
            return res.status(400).json({error: "You left some field in blank, all the fields should be filled out"})
        }
        const user = await prisma.user.findUnique({
            where: {email, username}
        })
        if(!user){
            return res.status(401).json({error: "Invalid username or password"})
        }

        const isValidPsswd = await bcrypt.compare(password, user.password)

        if(!isValidPsswd) {
            return res.status(401).send({error: "Invalid username or password"})
        }
        req.session.user = user
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during login"})
    }
})

router.get("/me", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "not logged in" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.session.user.user_id }, 
            select: { username: true }
        }); 
        res.json({ user_id: req.session.user.user_id, username: user.username, latitude: req.session.user.latitude, longitude: req.session.user.longitude})
    } catch (error) {
        res.status(401).json({ message: "not logged in" })
    }
})


router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" })
        }
        res.clearCookie("sessionId"); 
        res.json({ message: "Logged out succesfully" })
    })
})

module.exports = router