const express = require('express');
const app = express() ;
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000 ;


// middleware 
app.use(cors()) ;
app.use(express.json()) ;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const sportsCollection = client.db("sportsCollection").collection("equipments");


// create a new equipment 
app.post("/equipments", async(req,res) =>{
    const equip = req.body ;
    // console.log(equip) ;
    const result = await sportsCollection.insertOne(equip) ;
    res.send(result)
})

// get all equipment 
app.get("/equipments", async(req,res)=> {
       const cursor = sportsCollection.find() ;
       const result = await cursor.toArray() ;
       res.send(result)
})

// get first 6 equipments 
app.get("/equipments/limit", async(req,res)=> {
       const cursor = sportsCollection.find().limit(8) ;
       const result = await cursor.toArray() ;
       res.send(result)
})


// get one equipment 
app.get("/equipments/id/:id",async(req, res) => {
    const id = req.params.id ;
    const query = {_id: new ObjectId(id)} ;
    const result = await sportsCollection.findOne(query) ;
    res.send(result)
})


// get all equipments added by one user
app.get("/equipments/user/:email", async(req, res) => {
    const email = req.params.email ;
    // console.log(email)
    const query = {email: email} ;
    const result = await sportsCollection.find(query).toArray() ;
    res.send(result)
})


// delete one data 
app.delete("/equipments/id/:id", async(req, res) => {
    const id = req.params.id ;
    // console.log(id) ;
    const query = {_id: new ObjectId(id)} ;
    const result = await sportsCollection.deleteOne(query) ;
res.send(result)
})


// UPDATE one equip data 
app.patch("/equipments/id/:id", async(req, res) => {
const id = req.params.id ;
console.log(req.body.ratings)
console.log(id)
const filter = {_id: new ObjectId(id)}
const options = { upsert: true };
const updatedDoc = {
    $set: {
        item:req.body.item,
        category:req.body.category,
        price:req.body.price,
        customization:req.body.customization,
        description:req.body.description,
        stock:req.body.stock,
        photo:req.body.photo,
        rating:req.body.rating,
        delivery:req.body.delivery
    }
}
const result = await sportsCollection.updateOne(filter,updatedDoc,options) ;
res.send(result)
})



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req, res) => {
    res.send("my sporty server is running bro") ;
})

app.listen(port, () => {
    console.log(`sports server running on port : ${port}`) ;
})