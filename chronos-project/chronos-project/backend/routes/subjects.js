const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../store");

const router = express.Router();

// GET /api/subjects - list all subjects
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.subjects);
});

// POST /api/subjects - create a subject. `name` and `code` are required.
router.post("/", (req, res) => {
  const { name, code, dept, sem, weeklyHours, isLab, credits } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Subject name is required." });
  }

  const db = readDB();
  const subject = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    code: (code || String(name).slice(0, 4)).toUpperCase(),
    dept: dept || "",
    sem: Number(sem) || 1,
    weeklyHours: Number(weeklyHours) || 3,
    isLab: Boolean(isLab),
    credits: Number(credits) || (isLab ? 1 : 3),
  };
  db.subjects.push(subject);
  writeDB(db);
  res.status(201).json(subject);
});

// DELETE /api/subjects/:id
router.delete("/:id", (req, res) => {
  const db = readDB();
  const before = db.subjects.length;
  db.subjects = db.subjects.filter((s) => s.id !== req.params.id);
  if (db.subjects.length === before) {
    return res.status(404).json({ error: "Subject not found." });
  }
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
