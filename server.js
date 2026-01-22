const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse/lib/pdf-parse");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// File upload config
const upload = multer({ dest: "uploads/" });

// Skill keywords
const skills = {
  fullstack: ["html", "css", "javascript", "node", "express", "mongodb", "api"],
  datascience: ["python", "pandas", "numpy", "machine learning", "sql"],
  ml: ["python", "tensorflow", "pytorch", "model", "dataset"]
};

// Upload route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const data = await pdfParse(fs.readFileSync(req.file.path));
    const text = data.text.toLowerCase();
    const role = req.body.role;

    const roleSkills = skills[role];
    const matched = roleSkills.filter(s => text.includes(s));
    const missing = roleSkills.filter(s => !text.includes(s));

    const score = Math.round((matched.length / roleSkills.length) * 100);

    res.json({ matched, missing, score });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading PDF");
  }
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
