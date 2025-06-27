const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const router = express.Router()

router.post('/signup', async(req, res) => {
    try {
        const { email, username, password, latitude, longitude  } = req.body
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

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
               email, 
               username, 
               password: hashedPassword, 
               latitude, 
               longitude
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
        console.log(user)
        req.session.user = user
        res.json({ message: `Good to see you again, ${username}`})
        // res.json({message: "Login succesful!"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during login"})
    }
})

router.get("/me", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.session.user.user_id }, 
            select: { username: true }
        }); 
        res.json({ id: req.session.user.user_id, username: user.username })
    } catch (error) {
        res.status(401).json({ message: "not logged in" })
    }
})


router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" })
        }
        res.clearCookie("connect.sid"); 
        res.json({ message: "Logged out succesfully" })
    })
})

module.exports = router