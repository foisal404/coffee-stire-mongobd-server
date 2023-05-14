const express = require('express');
const app=express();
const port=process.env.PORT|| 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("coffe store running ...")
})
//mongo db

// console.log(process.env.Dot_username);

const uri = `mongodb+srv://${process.env.Dot_username}:${process.env.Dot_password}@cluster0.pxrxjz6.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("coffeeDB");
    const coffeeColection = database.collection("coffeeColection");
    app.post('/coffees',async(req,res)=>{
        const coffee=req.body;
        console.log(coffee);
        const result=await coffeeColection.insertOne(coffee)
        res.send(result)
    })
    app.get("/coffees",async(req,res)=>{
        const cursor = coffeeColection.find();
        const result=await cursor.toArray();
        res.send(result)
    })
    app.delete("/coffees/:id",async(req,res)=>{
        const id =req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeColection.deleteOne(query);
        res.send(result)
    })
    app.get('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeColection.findOne(query);
        res.send(result)
    })
    app.put('/update/:id',async(req,res)=>{
        const id=req.params.id;
        const coffee=req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateCoffee = {
            $set: {
              name:coffee.name,
              chef:coffee.chef,
              category:coffee.category,
              taste:coffee.taste,
              suplier:coffee.suplier,
              details:coffee.details,
              photo:coffee.photo,
            },
          };
          const result = await coffeeColection.updateOne(filter, updateCoffee, options);
          res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`coffestore on port ${port}`)
})