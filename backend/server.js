/* eslint-env node */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB client with TLS
const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  tls: true,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("loan"); // must match name in URI (/loan)
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectDB();

/* ✅ SIGNUP */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const users = db.collection("users");

    // optional: check if email exists
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    await users.insertOne({
      name,
      email,
      password, // for demo only; in real app hash it
      role,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User created", user: { name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/* ✅ SIGNIN */
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const users = db.collection("users");

    const user = await users.findOne({ email, password, role });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signin failed" });
  }
});

/* Health check */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
