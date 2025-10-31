const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ CORS and backend working fine!" });
});

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ Backend running locally on port 5000");
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
  const { username, password, role, batch } = req.body;
  console.log("Login attempt:", { username, role, batch });

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
    res.status(500).json({ success: false, message: "Login error", err: err.message });
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

// ✅ Student login alias
app.post("/student/login", (req, res) => {
  req.url = "/api/login";
  app._router.handle(req, res);
});

// ✅ Start the Server (local only)
const port = 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
