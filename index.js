const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0jahed.ldqz6dp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db("techDB").collection("users");
    const subscribeCollection = client.db("techDB").collection("subscribe");
    const reviewCollection = client.db("techDB").collection("reviews");
    const productCollection = client.db("techDB").collection("allProducts");


    // app.get("/featuredProducts", async (req, res) => {
    //   const cursor = featuredProductsCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    app.get("/allProducts", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/subscribe", async (req, res) => {
      const cursor = subscribeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/allProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      });
    app.post("/subscribe", async (req, res) => {
        const newSubscribe = req.body;
        const result = await subscribeCollection.insertOne(newSubscribe);
        res.send(result);
      });

      app.post("/review", async (req, res) => {
        const newReview = req.body;
        const result = await reviewCollection.insertOne(newReview);
        res.send(result);
      });

      app.put('/upvotes/:productId', async (req, res) => {
          const productId = req.params.productId;
          const { upvotes } = req.body;
      
          const result = await productCollection.findOneAndUpdate(
            { _id: new ObjectId(productId) },
            { $set: { upvotes } },
            { returnDocument: 'after' } // Return the updated document
          );
          res.json({ success: true, upvotes });
      });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});