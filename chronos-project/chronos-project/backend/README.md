# Chronos Backend

A small Express API that gives Chronos real, server-side persistence for
faculty (and the department/subject reference data faculty records point
to), instead of only storing them in the browser's localStorage.

Data is stored in `data/db.json`. This keeps the backend dependency-light
(no native database driver to compile) while still being a real,
independent source of truth that multiple browsers/devices can share.
Swapping `store.js` for SQLite/Postgres/MongoDB later does not require
changing any of the route files.

## Setup

```bash
cd backend
npm install
npm start
```

The server listens on `http://localhost:4000` by default. Set the `PORT`
environment variable to use a different port.

## API Reference

### Health

| Method | Path          | Description        |
|--------|---------------|---------------------|
| GET    | `/api/health` | Returns `{status:"ok"}` |

### Faculty

| Method | Path                | Description                              |
|--------|---------------------|-------------------------------------------|
| GET    | `/api/faculty`      | List all faculty                          |
| GET    | `/api/faculty/:id`  | Get a single faculty member               |
| POST   | `/api/faculty`      | Create a faculty member (`name` required) |
| PUT    | `/api/faculty/:id`  | Update a faculty member                   |
| DELETE | `/api/faculty/:id`  | Delete a faculty member                   |

Faculty record shape:

```json
{
  "id": "uuid",
  "name": "Dr. A. Sharma",
  "dept": "CSE",
  "subjects": ["sub-ds"],
  "availDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "preference": "Morning",
  "maxHoursWeek": 18,
  "unavailable": []
}
```

`name` is required on create; the API returns `400` with an `error`
message if it is missing or blank.

### Departments

| Method | Path                    | Description                    |
|--------|-------------------------|----------------------------------|
| GET    | `/api/departments`      | List all departments             |
| POST   | `/api/departments`      | Create a department (`name` required) |
| DELETE | `/api/departments/:id`  | Delete a department              |

### Subjects

| Method | Path                | Description                          |
|--------|---------------------|----------------------------------------|
| GET    | `/api/subjects`      | List all subjects                     |
| POST   | `/api/subjects`      | Create a subject (`name` required)    |
| DELETE | `/api/subjects/:id`  | Delete a subject                      |

## Example requests

```bash
# List faculty
curl http://localhost:4000/api/faculty

# Add a faculty member
curl -X POST http://localhost:4000/api/faculty \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. New Person","dept":"CSE","preference":"Morning","maxHoursWeek":16}'

# Update a faculty member
curl -X PUT http://localhost:4000/api/faculty/<id> \
  -H "Content-Type: application/json" \
  -d '{"maxHoursWeek":20}'

# Delete a faculty member
curl -X DELETE http://localhost:4000/api/faculty/<id>
```
