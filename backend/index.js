const express = require('express')
const cors = require('cors')
const app = express()
const session = require('express-session')
const PORT = 3000
const authRouter = require('./routes/auth')
const postRouter = require('./routes/postRoutes')
app.use(express.json())


const corsOptions = {
    origin: 'http://localhost:5174', 
    credentials: true,
}
app.use(cors(corsOptions))

let sessionConfig = {
  name: 'sessionId',
  secret: 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.RENDER ? true : false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
}

app.use(session(sessionConfig))
app.use(authRouter)
app.use(postRouter)
app.get('/homepage', (req, res) => {
    res.send("Backend here"); 
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

