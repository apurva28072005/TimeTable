const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../store");

const router = express.Router();

function sanitize(body, existing) {
  const base = existing || {
    subjects: [],
    availDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    preference: "Any",
    maxHoursWeek: 18,
    unavailable: [],
  };

  const out = { ...base };

  if (body.name !== undefined) out.name = String(body.name).trim();
  if (body.dept !== undefined) out.dept = body.dept;
  if (body.subjects !== undefined) {
    out.subjects = Array.isArray(body.subjects) ? body.subjects : base.subjects;
  }
  if (body.availDays !== undefined) {
    out.availDays =
      Array.isArray(body.availDays) && body.availDays.length
        ? body.availDays
        : base.availDays;
  }
  if (body.preference !== undefined) out.preference = body.preference || "Any";
  if (body.maxHoursWeek !== undefined) {
    const n = Number(body.maxHoursWeek);
    out.maxHoursWeek = Number.isFinite(n) && n > 0 ? n : base.maxHoursWeek;
  }
  if (body.unavailable !== undefined) {
    out.unavailable = Array.isArray(body.unavailable) ? body.unavailable : base.unavailable;
  }

  return out;
}

// GET /api/faculty  - list all faculty
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.faculty);
});

// GET /api/faculty/:id - single faculty record
router.get("/:id", (req, res) => {
  const db = readDB();
  const fac = db.faculty.find((f) => f.id === req.params.id);
  if (!fac) return res.status(404).json({ error: "Faculty not found." });
  res.json(fac);
});

// POST /api/faculty - create a faculty member. `name` is required.
router.post("/", (req, res) => {
  const name = req.body && req.body.name ? String(req.body.name).trim() : "";
  if (!name) {
    return res.status(400).json({ error: "Faculty name is required." });
  }

  const db = readDB();
  const faculty = {
    id: crypto.randomUUID(),
    ...sanitize(req.body),
    name,
  };
  db.faculty.push(faculty);
  writeDB(db);
  res.status(201).json(faculty);
});

// PUT /api/faculty/:id - update an existing faculty member
router.put("/:id", (req, res) => {
  const db = readDB();
  const idx = db.faculty.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Faculty not found." });

  if (req.body && req.body.name !== undefined && !String(req.body.name).trim()) {
    return res.status(400).json({ error: "Faculty name is required." });
  }

  const updated = { ...db.faculty[idx], ...sanitize(req.body, db.faculty[idx]), id: db.faculty[idx].id };
  db.faculty[idx] = updated;
  writeDB(db);
  res.json(updated);
});

// DELETE /api/faculty/:id - remove a faculty member
router.delete("/:id", (req, res) => {
  const db = readDB();
  const before = db.faculty.length;
  db.faculty = db.faculty.filter((f) => f.id !== req.params.id);
  if (db.faculty.length === before) {
    return res.status(404).json({ error: "Faculty not found." });
  }
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
