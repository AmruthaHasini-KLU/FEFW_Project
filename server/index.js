const express = require("express");
const cors = require("cors");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const app = express();
app.use(cors());
app.use(express.json());

// DB setup
const adapter = new JSONFile("db.json");
const defaultData = { users: [], offers: [], payments: [] };
const db = new Low(adapter, defaultData);

async function initDb() {
  await db.read();
  if (!db.data) db.data = defaultData;
}
initDb();

// health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AUTH ROUTES

// helper to ensure DB loaded
async function ensureDb() {
  await db.read();
  if (!db.data) db.data = defaultData;
}

// SIGNUP (POST)
app.post("/api/signup", async (req, res) => {
  await ensureDb();
  const { name, email, password, role, aadhar, pan } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const exists = db.data.users.some(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = {
    id: String(Date.now()),
    name,
    email,
    password, // demo only, not hashed
    role,
    aadhar: aadhar || null,
    pan: pan || null,
  };

  db.data.users.push(user);
  await db.write();

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    aadhar: user.aadhar,
    pan: user.pan,
  });
});

// LOGIN (POST)
app.post("/api/login", async (req, res) => {
  await ensureDb();
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  const user = db.data.users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    aadhar: user.aadhar,
    pan: user.pan,
  });
});

// root (optional)
app.get("/", (req, res) => {
  res.send("Fynvia backend is running");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
