const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS — must be on top
app.use(cors({
  origin: [
    "https://p-portal-e8v5.vercel.app", // your deployed frontend
    "http://localhost:3000"             // local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Handle preflight requests (important for CORS)
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection (only connect if not already)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

// ✅ Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["student", "faculty"] },
  batch: String,
});
const User = mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
  batch: String,
  projectLink: String,
  status: { type: String, default: "Pending" },
  marks: { type: String, default: "" },
});
const Project = mongoose.model("Project", projectSchema);

// ✅ Test Route — for CORS + health
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ CORS and backend working fine!" });
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend running on Vercel");
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
  const { username, password, role, batch } = req.body;

  try {
    const user = await User.findOne({ username, role });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (role === "student" && user.batch && user.batch !== batch) {
      return res.status(401).json({ success: false, message: "Invalid batch." });
    }

    res.json({
      success: true,
      message: `${role} Login Success`,
      user: { username, role, batch: user.batch || null },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ success: false, message: "Login error", err });
  }
});

// ✅ Projects API
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

app.post("/api/projects", async (req, res) => {
  const { batch, projectLink } = req.body;

  if (!batch || !projectLink) {
    return res.status(400).json({ message: "Batch & Project link required" });
  }

  try {
    const newProject = await Project.create({ batch, projectLink });
    res.status(201).json(newProject);
  } catch {
    res.status(500).json({ message: "Error adding project" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { marks: req.body.marks, status: "Complete" },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error updating project" });
  }
});

// ✅ Fallback route for student login alias
app.post("/student/login", (req, res) => {
  req.url = "/api/login";
  app._router.handle(req, res);
});

// ✅ Export app for Vercel (do NOT app.listen here)
module.exports = app;
