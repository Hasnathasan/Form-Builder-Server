const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())

require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmw0s1b.mongodb.net/?retryWrites=true&w=majority`;
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

    const formDataCollection = client.db("Form-Builder").collection("form-data");

    app.get("/form", async(req, res) => {
      const result = await formDataCollection.find().toArray();
      res.send(result)
    })

    app.post("/form", async(req, res) => {
      const data = req.body;
      const result = await formDataCollection.insertOne(data);
      res.send(result)
    })


    app.get("/eachform/:formId", async(req, res) => {
      const formId = req.params.formId;
      const query = { _id: new ObjectId(formId)}
      const result = await formDataCollection.findOne(query);
      res.send(result)
    })









    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Form-Server is running!');
})



app.listen(port, () => {
  console.log(`Form Server is running on ${port}`)
})