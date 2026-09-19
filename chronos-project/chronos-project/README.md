# Chronos \u2013 Smart Academic Timetable AI

This project has two parts:

```
chronos-project/
\u251c\u2500\u2500 backend/     Express API \u2014 stores faculty (and department/subject reference data) in backend/data/db.json
\u2514\u2500\u2500 frontend/    The Chronos single-page web app (index.html)
```

Previously, faculty data lived only in the browser's localStorage. The
`backend/` folder adds a real server-side data store for faculty, and
`frontend/index.html` has been updated to read and write faculty records
through that backend instead. All other modules (subjects, divisions,
rooms, timetable generation, etc.) still use localStorage as before.

## Running it

**1. Start the backend** (in one terminal):

```bash
cd backend
npm install
npm start
```

This starts the API on `http://localhost:4000`. Faculty data is stored in
`backend/data/db.json`, seeded with a few example faculty members.

**2. Serve the frontend** (in another terminal):

```bash
cd frontend
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in your browser.

> The frontend expects the backend at `http://localhost:4000/api` by
> default. To point it at a different backend URL (e.g. once deployed),
> set `window.CHRONOS_API_BASE = "https://your-api.example.com/api";`
> in a `<script>` tag before `index.html`'s main script runs.

## What changed in the frontend

In `frontend/index.html`:

- A `FacultyAPI` helper (`list`, `create`, `update`, `remove`) calls the
  backend's `/api/faculty` endpoints using `fetch`.
- `App.init()` now loads faculty from the backend on startup and mirrors
  it into the existing local `db.faculty` / localStorage cache, so the
  rest of the app (timetable generator, workload view, etc.) keeps
  working unchanged.
- The Faculty Management page's **Add/Edit** save action and **Delete**
  action now call the backend first; the local cache and UI only update
  after the backend confirms the change. If the backend is unreachable,
  the app falls back to whatever faculty data was last cached locally
  and shows an error toast on save/delete attempts.

## Extending the backend

`backend/store.js` is the only file that touches disk. To move from the
JSON file store to SQLite, Postgres, or MongoDB, rewrite `readDB`/
`writeDB` there \u2014 the route files in `backend/routes/` do not need to
change. The same route pattern used for faculty can be copied to add
persistence for subjects, divisions, rooms, and timetables.
