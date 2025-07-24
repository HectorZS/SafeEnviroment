// require("dotenv").config()
// const express = require('express')
// const cors = require('cors')
// const app = express()
// const session = require('express-session')
// const {RedisStore} = require("connect-redis")
// const {createClient} = require("redis")
// const loadModel = require('./utils/semanticModel')
// const PORT = 3000
// const authRouter = require('./routes/auth')
// const postRouter = require('./routes/postRoutes')
// const chatroomRouter = require('./routes/chatRoomRoutes')
// const messagesRouter = require('./routes/messagesRoutes')
// app.use(express.json())

// const corsOptions = {
//     origin: ['http://localhost:5173', "https://safeenviroment-frontend.onrender.com"], 
//     credentials: true,
// }
// app.use(cors(corsOptions))

// const client = createClient({
//     legacyMode: true,
//     url: process.env.REDIS_DB_URL,
//     socket: {
//       tls: true
//     }
// });

// client.connect().catch(console.error); 
// const store = new RedisStore({ client: client})


// let sessionConfig = {
//   name: 'sessionId',
//   store: store, 
//   secret: process.env.SECRET,
//   cookie: {
//     maxAge: 1000 * 60 * 30,
//     secure: process.env.RENDER === "production",
//     httpOnly: false,
//     sameSite: process.env.RENDER === "production" ? 'none' : 'lax', 
//   },
//   resave: false,
//   saveUninitialized: false,
// }

// app.use(session(sessionConfig))
// app.set("trust proxy", 1)
// app.use(authRouter)
// app.use(postRouter)
// app.use(chatroomRouter)
// app.use(messagesRouter)
// loadModel().then(() => {
//   console.log("Modelo listo")
// }).catch(err => {
//   console.error('Error cargando modelo', err)
// })

// app.get('/homepage', (req, res) => {
//     res.send("Backend here"); 
// })


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// })

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const {RedisStore} = require("connect-redis");
const {createClient} = require("redis");
const PORT = 3000;
const authRouter = require('./routes/auth');
const postRouter = require('./routes/postRoutes');
const chatroomRouter = require('./routes/chatRoomRoutes');
const messagesRouter = require('./routes/messagesRoutes');
const tf = require('@tensorflow/tfjs-node'); 
const use = require('@tensorflow-models/universal-sentence-encoder');
let model;
const loadModel = async () => {
  try {
    await tf.ready(); // tensor flow loading
    console.log('Loading embeddings model...');
    model = await use.load();
    console.log('Model loaded successfully');
    return model;
  } catch (err) {
    console.error('Error loading the model: ', err);
    throw err;
  }
};

app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:5173', "https://safeenviroment-frontend.onrender.com"], 
    credentials: true,
};
app.use(cors(corsOptions));
const client = createClient({
    legacyMode: true,
    url: process.env.REDIS_DB_URL,
    socket: {
      tls: true
    }
});


client.connect().catch(console.error); 
const store = new RedisStore({ client: client});


let sessionConfig = {
  name: 'sessionId',
  store: store, 
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: process.env.RENDER === "production",
    httpOnly: false,
    sameSite: process.env.RENDER === "production" ? 'none' : 'lax', 
  },
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));
app.set("trust proxy", 1);
// load model when initializing the server
loadModel().then(() => {
  console.log('Model ready for recommendations');
}).catch(err => {
  console.error('Could not load model: ', err);
});
app.use(authRouter);
app.use(postRouter);
app.use(chatroomRouter);
app.use(messagesRouter);


app.get('/homepage', (req, res) => {
    res.send("Backend here"); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports.getModel = () => model;



