const express = require('express'); 
const cors = require('cors')
const app = express();
const PORT = 3000; 

app.use(cors()); 

app.get('/homepage', (req, res) => {
    res.send("Backend here"); 
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

