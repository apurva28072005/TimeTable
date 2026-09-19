const express = require("express");
const cors = require("cors");

const facultyRoutes = require("./routes/faculty");
const departmentRoutes = require("./routes/departments");
const subjectRoutes = require("./routes/subjects");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/faculty", facultyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);

// Fallback 404 for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Chronos backend listening on http://localhost:${PORT}`);
  console.log(`Faculty data is stored in backend/data/db.json`);
});
