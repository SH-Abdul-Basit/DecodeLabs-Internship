# DecodeLabs-Internship
This repository contains the projects I worked on during my tenure as a Backend Engineer Intern at DecodeLabs. These projects reflect my hands-on experience in backend development, API integration, database management, and building scalable server-side applications.

# Express JSON API Server

A lightweight, stateless REST API built with Node.js and Express. All data is stored in-memory — no database required. The entire server lives in a single file: `server.js`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes with Node.js)

---

## Setup & Run

```bash
# 1. Install dependencies
npm install express

# 2. Start the server
node server.js
```

Server starts at: **http://localhost:3000**

---

## Project Structure

```
express-server/
├── server.js     # Entire application — middleware, data, and all routes
├── package.json  # Project metadata and dependencies
└── README.md     # This file
```

---

## API Endpoints

### Root

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Returns an overview of all available endpoints |

---

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Returns all users |
| GET | `/api/users/:id` | Returns a single user by ID |
| POST | `/api/users` | Creates a new user |
| DELETE | `/api/users/:id` | Deletes a user by ID |

#### POST /api/users — Request Body

```json
{
  "name": "Dana Lee",
  "email": "dana@example.com",
  "role": "user"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ Yes | |
| `email` | string | ✅ Yes | Must be a valid email, must be unique |
| `role` | string | ❌ No | Defaults to `"user"` |

---

### Products

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Returns all products (supports filters) |
| GET | `/api/products/:id` | Returns a single product by ID |
| POST | `/api/products` | Creates a new product |

#### GET /api/products — Query Filters

```
GET /api/products?category=electronics
GET /api/products?inStock=true
GET /api/products?category=furniture&inStock=true
```

| Parameter | Type | Example |
|-----------|------|---------|
| `category` | string | `electronics`, `furniture`, `stationery` |
| `inStock` | boolean | `true` or `false` |

#### POST /api/products — Request Body

```json
{
  "name": "Mechanical Mouse",
  "category": "electronics",
  "price": 59.99,
  "stock": 30
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ Yes | |
| `category` | string | ✅ Yes | Stored as lowercase |
| `price` | number | ✅ Yes | Must be non-negative |
| `stock` | number | ❌ No | Defaults to `0`. Sets `inStock` automatically |

---

## JSON Response Format

All responses follow a consistent shape:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors return `success: false` with a descriptive message:

```json
{
  "success": false,
  "error": "User 99 not found"
}
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| `200` | OK | Successful GET or DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing or invalid fields in body |
| `404` | Not Found | ID doesn't exist or route is unknown |
| `409` | Conflict | Duplicate email on user creation |
| `500` | Server Error | Unexpected runtime error |

---

## Example curl Commands

```bash
# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Dana Lee", "email": "dana@example.com"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1

# Get all products
curl http://localhost:3000/api/products

# Filter products by category and stock
curl "http://localhost:3000/api/products?category=electronics&inStock=true"

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mechanical Mouse", "category": "electronics", "price": 59.99, "stock": 30}'
```

> **Tip:** Add the `-i` flag to any curl command to see the HTTP status code in the response headers.
> ```bash
> curl -i http://localhost:3000/api/users/999
> # → HTTP/1.1 404 Not Found
> ```

---

## Key Concepts

| Concept | Where in code |
|---------|--------------|
| JSON body parsing | `app.use(express.json())` |
| Route parameters | `req.params.id` |
| Query string filters | `req.query.category` |
| Input validation | Inline `errors[]` array before each POST |
| HTTP status codes | `res.status(404).json(...)` |
| 404 catch-all | `app.use(...)` after all routes |
| Global error handler | `app.use((err, req, res, next) => ...)` |

---

## Notes

- **Stateless:** All data resets when the server restarts. There is no database.
- **Single file:** All routes, middleware, and data live in `server.js` — no separate route files.
- **Port:** Defaults to `3000`. Change the `PORT` constant at the top of `server.js` to use a different port.
