require("dotenv").config()
const express = require('express')
const cors = require('cors')
const app = express()
const session = require('express-session')
const {RedisStore} = require("connect-redis")
const {createClient} = require("redis")
const PORT = 3000
const authRouter = require('./routes/auth')
const postRouter = require('./routes/postRoutes')
app.use(express.json())

const client = createClient({
    legacyMode: true,
    url: process.env.REDIS_DB_URL,
    socket: {
      tls: true
    }
});

const corsOptions = {
    origin: ['http://localhost:5174', "https://safeenviroment-frontend.onrender.com"], 
    credentials: true,
}
app.use(cors(corsOptions))

client.connect().catch(console.error); 
const store = new RedisStore({ client: client})


// let sessionConfig = {
//   name: 'sessionId',
//   store: store, 
//   secret: process.env.SECRET,
//   cookie: {
//     maxAge: 1000 * 60 * 5,
//     secure: process.env.RENDER === "production" ? true : false,
//     httpOnly: false,
//     sameSite: process.env.RENDER === "production" ? 'none' : 'lax', 
//   },
//   resave: false,
//   saveUninitialized: false,
// }

// app.use(session(sessionConfig))
// app.set("trust proxy", 1)
let sessionConfig = { // new
  name: 'sessionId',
  store: store,
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
  },
  resave: false,
  saveUninitialized: false,
}

app.set("trust proxy", 1) // keep this for proxy support
app.use(session(sessionConfig)) // new
app.use(authRouter)
app.use(postRouter)
app.get('/homepage', (req, res) => {
    res.send("Backend here"); 
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

