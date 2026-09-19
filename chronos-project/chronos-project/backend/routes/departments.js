const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../store");

const router = express.Router();

// GET /api/departments - list all departments
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.departments);
});

// POST /api/departments - create a department. `name` is required.
router.post("/", (req, res) => {
  const name = req.body && req.body.name ? String(req.body.name).trim() : "";
  if (!name) return res.status(400).json({ error: "Department name is required." });

  const db = readDB();
  const dept = { id: req.body.id || crypto.randomUUID(), name };
  db.departments.push(dept);
  writeDB(db);
  res.status(201).json(dept);
});

// DELETE /api/departments/:id
router.delete("/:id", (req, res) => {
  const db = readDB();
  const before = db.departments.length;
  db.departments = db.departments.filter((d) => d.id !== req.params.id);
  if (db.departments.length === before) {
    return res.status(404).json({ error: "Department not found." });
  }
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
