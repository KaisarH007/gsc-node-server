const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const { json } = require("express");

const app = express();
const port = process.env.PORT || 5000;

//Middle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gwaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect(); //this code coonect server to mongodb
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET A SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("get specifiq id", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //POST API

    app.post("/services", async (req, res) => {
      const service = req.body;

      console.log("hitting the  post", service);

      const result = await servicesCollection.insertOne(service);

      res.json(result);

      console.log(result);
    });

    //DELTE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running genius server");
});

app.listen(port, () => {
  console.log("Running GCM server port on", port);
});
