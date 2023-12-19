const express = require('express')
const app = express()
const port = process.env.PORT|| 3000;
require('dotenv').config()
let cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const alluserCollection = client.db("Eduhub").collection("Users");
    const allCourseCollection = client.db("Eduhub").collection("Courses");
    const allCartCourse = client.db("Eduhub").collection("CartCourse");

app.post('/alluser' , async (req, res)=>{
let user=req.body;
let query={email: user.email}
let Existsuser= await alluserCollection.findOne(query);
if (Existsuser) {
  return res.send({message:'already exist'})
}
const result = await alluserCollection.insertOne(user);
res.send(result);

})

app.get('/alluser' ,async (req,res)=>{

    const users= await alluserCollection.find().toArray()
    res.send(users)

})
app.get('/alluser/:email' ,async (req,res)=>{
 let singleuser= req.params.email
 let query = {email : singleuser}
    const users= await alluserCollection.findOne(query)
    res.send(users)

})
app.post('/course' ,async (req,res)=>{
 let courses= req.body
 let result=await allCourseCollection.insertOne(courses)
 res.send(result)
   
})
app.get('/course' ,async (req,res)=>{
 let courses= req.body
 let result=await allCourseCollection.find(courses).toArray()
 res.send(result)
   
})
app.put('/course/:id' ,async (req,res)=>{
  const courseId = req.params.id;
 let courses= req.body
 let id = req.params.id
 
 const isUserEnrolled = await allCourseCollection.findOne({
  _id: new ObjectId(courseId),
  'enrolledStudent.id': courses.id,
  
});

if (isUserEnrolled) {
  return res.status(400).json({ message: 'You already enrolled in the course' });
}
 const filter ={ _id : new ObjectId(id) }
 const options = { upsert: true };
 const updateDoc = {
  $push: { enrolledStudent: { id: courses.id, email:courses.email } }
  
};
let result = await allCourseCollection.updateOne(filter, updateDoc, options);
 res.send(result)
   
})



app.get('/course/:id' ,async (req,res)=>{

 let id = req.params.id
 const filter ={ _id : new ObjectId(id) }
 
let result = await allCourseCollection.findOne(filter);
 res.send(result)
   
})



app.post('/cart', async (req ,res) =>{

  let cartitem= req.body;

  const existingCartItem = await allCartCourse.findOne({
    userId: cartitem.userId,
    _id: new ObjectId(cartitem._id) ,
  });
  if (existingCartItem) {
   
    return res.status(400).json({ message: 'course is already in the cart' });
  }
  let result=await allCartCourse.insertOne(cartitem)
  res.send(result)


})
app.get('/cart', async (req ,res) =>{

  let cartitem= req.body;
  let result=await allCartCourse.find(cartitem).toArray()
  res.send(result)


})


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