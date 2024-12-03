const express = require('express');
const app = express() ;
const cors = require('cors');
const port = process.env.PORT || 5000 ;


// middleware 
app.use(cors()) ;
app.use(express.json()) ;





app.get("/",(req, res) => {
    res.send("my sporty server is running bro") ;
})

app.listen(port, () => {
    console.log(`sports server running on port : ${port}`) ;
})