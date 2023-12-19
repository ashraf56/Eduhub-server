const express = require('express')
const app = express()
const port = process.env.PORT|| 3000;
require('dotenv').config()
let cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nj1o0g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    




    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Eduhub !')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })