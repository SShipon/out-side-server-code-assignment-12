const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { response } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyvbtey.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//  try finally function

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("Bike").collection("products");
    const reviewCollection = client.db("user-Review").collection("reviews");
    const profileCollection = client.db("My-Profile").collection("profile");

    /* product database get */
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    /* Product add */

    app.post("/bikeAdd", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });



    /*=========== add your reviews add ===============  */

    // add review
    app.post("/reviews", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });

    // get review
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    /* update profile */

    app.post("/myprofile", async (req, res) => {
      const newService = req.body;
      const result = await profileCollection.insertOne(newService);
      res.send(result);
    });

    app.get("/myprofile/:email", async (req, res) => {
      const email = req.params;
      const cursor = profileCollection.find(email);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.put("/myprofile/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          education: updateUser.education,
          city: updateUser.city,
          phone: updateUser.phone,
        },
      };
      const result = await profileCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running server bike parts house server ");
});

app.listen(port, () => {
  console.log("server site running assignment-12", port);
});
