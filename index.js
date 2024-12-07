const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.esfshrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();

    // ?collection
    const visacollection = client.db("VisaDB").collection("visa");
    const applicationVisa = client.db("VisaDB").collection("applicationVisa");

    // POST - Add a new visa
    app.post("/addvisa", async (req, res) => {
      const newVisa = req.body;
      console.log(newVisa);
      const result = await visacollection.insertOne(newVisa);
      res.send(result);
    });

    // GET - Fetch all visas
    app.get("/addvisa", async (req, res) => {
      try {
        const visas = await visacollection.find().toArray();
        res.send(visas);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch visas" });
      }
    });

    //
    app.delete("/addvisa/:id", async (req, res) => {
      const visaId = req.params.id;
      const result = await visacollection.deleteOne({
        _id: new ObjectId(visaId),
      });

      res.send(result);
    });

    //! application for visa
    app.post("/myvisa", async (req, res) => {
      const newVisa = req.body;
      console.log(newVisa);
      const result = await applicationVisa.insertOne(newVisa);
      res.send(result);
    });

    app.get("/myvisa", async (req, res) => {
      const visas = await applicationVisa.find().toArray();
      res.send(visas);
    });

    //
    app.delete("/myvisa/:id", async (req, res) => {
      const visaId = req.params.id;
      const result = await applicationVisa.deleteOne({
        _id: new ObjectId(visaId),
      });

      res.send(result);
    });

    // TODO: Update
    // app.patch("/addvisa", async (res, req) => {
    //   const id = req.params.id;
    //   // console.log(id);
    // });

    // ! my application
    // GET - Fetch applications by email
    app.get("/myvisa/:email", async (req, res) => {
      const email = req.params.email; // Extract email from request params
      // console.log(email);

      try {
        // Query the database for all documents with the matching email
        const applications = await applicationVisa.find({ email }).toArray();

        // Check if there are matching results
        if (applications.length === 0) {
          return res
            .status(404)
            .json({ message: "No applications found for this email" });
        }

        // Respond with the matched applications
        res.status(200).send(applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res
          .status(500)
          .send({ message: "Failed to fetch applications", error });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server Running...");
});
