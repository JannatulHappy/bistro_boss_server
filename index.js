const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
// middleware
// app.use(
//   cors({
//     // origin:["firebase_host_link"],
//     origin: [
//       // 'http://localhost:5173',
//       "https://careervolt-f325b.firebaseapp.com",
//       "https://careervolt-f325b.web.app",
//       "http://localhost:5173",
//     ],
//     credentials: true,
//   })
// );
app.use(
  cors({
    // origin:["firebase_host_link"],
    origin: [
      // 'http://localhost:5173',
      "https://career-volt-02.firebaseapp.com",
      "https://career-volt-02.web.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wlf4d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middlewares
const logger = (req, res, next) => {
  console.log("log: info", req.method, req.url);
  next();
};

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  // console.log('token in the middleware', token);
  // no token available
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const jobsCollection = client.db("careerVoltDB").collection("jobs");
  
 
   

   

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

app.get("/", (req, res) => {
  res.send("Bistro Boss server is running");
});

app.listen(port, () => {
  console.log(`Bistro Boss server is running on port ${port}`);
});