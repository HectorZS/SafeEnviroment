const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const router = express.Router()
const getCoordsForAdressModule = require('./mapsRoutes.js');
const getCoordsForAdress = getCoordsForAdressModule.default;



router.post('/signup', async(req, res) => {
    let coordinates, lat, lng
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

        coordinates = await getCoordsForAdress(address)
        lat = coordinates.lat
        lng = coordinates.lng

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
               email, 
               username, 
               password: hashedPassword, 
               latitude: lat, 
               longitude: lng
            }
        })
        req.session.user = newUser
        res.status(201).json({message: "Signup succesfull"})
    } catch (error) {
    console.error(error)
    res.status(500).json({error: "Something went wrong"})
    }
})

router.post("/login", async(req, res) => {
    try {
        const { email, username, password } = req.body
        if (!username || !password || !email ) {
            return res.status(400).json({error: "You left some field in blank, all the fields should be filled out"})
        }
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user){
            return res.status(401).json({error: "Invalid username or password"})
        }

        const isValidPsswd = await bcrypt.compare(password, user.password)

        if(!isValidPsswd) {
            return res.status(401).json({error: "Invalid username or password"})
        }
        console.log("UUUUS: ", user)
        req.session.user = user
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during login"})
    }
})

router.get("/me", async (req, res) => {
    console.log("RENDER: ", process.env.RENDER)
    console.log("REquest: ", req.session)
    if (!req.session.user) {
        console.log("Trigger on user, not logged in")
        return res.status(401).json({ message: "not logged in" });
    }
    // console.log("/me, current's user session: ", req.session.user.user_id)
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.session.user.user_id }, 
            select: { username: true }
        }); 
        console.log("USER backend: ", user); 
        console.log("Backend user: ", user.username)
        res.json({ id: req.session.user.user_id, username: user.username, latitude: req.session.user.latitude, longitude: req.session.user.longitude})
    } catch (error) {
        console.log("ERROR in /me")
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