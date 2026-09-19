/**
 * Simple JSON-file backed data store.
 *
 * This keeps the backend dependency-light (no native modules to compile)
 * while still giving Chronos a real persistence layer instead of the
 * browser's localStorage. The read/write functions below are the only
 * place that touches the file system, so swapping this out for a real
 * database (SQLite, Postgres, MongoDB, etc.) later only means rewriting
 * this one file - the route handlers do not need to change.
 */
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data", "db.json");

function emptyDB() {
  return { departments: [], subjects: [], faculty: [] };
}

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      const fresh = emptyDB();
      writeDB(fresh);
      return fresh;
    }
    throw err;
  }
}

function writeDB(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

module.exports = { readDB, writeDB, DB_PATH };
