// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// require("dotenv").config();

// app.get("/", (req, res) => {
//   res.send("Hello from server");
// });
// // console.log(process.env.DB_USER);

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.esfshrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     // collection
//     const visacollection = client.db("VisaDB").collection("visa");

//     // ? post
//     app.post("/addvisa", async (req, res) => {
//       const newVisa = req.body;
//       console.log(newVisa);
//       const result = await visacollection.insertOne(newVisa);
//       res.send(result);
//     });
//     // ? get
//     app.get("/addvisa", async (req, res) => {
//       try {
//         const visas = await visacollection.find().toArray();
//         res.send(visas);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to fetch visas" });
//       }
//     });

//     // update

//     app.put("/addvisa/:id", async (req, res) => {
//       const visaId = req.params.id;
//       const updatedVisa = req.body;

//       // Update visa information
//       const result = await visacollection.updateOne(
//         { _id: new ObjectId(visaId) },
//         { $set: updatedVisa }
//       );

//       if (result.modifiedCount > 0) {
//         res.status(200).json({ message: "Visa updated successfully" });
//       } else {
//         res.status(404).json({ message: "Visa not found or no changes made" });
//       }
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log("Server Runing...");
// });

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

    // collection
    const visacollection = client.db("VisaDB").collection("visa");

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

    // PUT - Update a visa
    app.put("/addvisa/:id", async (req, res) => {
      const visaId = req.params.id;
      const updatedVisa = req.body;

      // Update visa information
      const result = await visacollection.updateOne(
        { _id: new ObjectId(visaId) },
        { $set: updatedVisa }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Visa updated successfully" });
      } else {
        res.status(404).json({ message: "Visa not found or no changes made" });
      }
    });

    // DELETE - Delete a visa
    app.delete("/addvisa/:id", async (req, res) => {
      const visaId = req.params.id;

      // Delete visa by ID
      const result = await visacollection.deleteOne({
        _id: new ObjectId(visaId),
      });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Visa deleted successfully" });
      } else {
        res.status(404).json({ message: "Visa not found" });
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
