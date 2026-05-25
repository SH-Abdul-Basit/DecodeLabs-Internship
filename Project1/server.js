import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware

// In Memory data -> Resets when the server is reloaded
const users = [
  { id: 1, name: "Abdul Basit", email: "basit@example.com", role: "admin", createdAt: "2024-01-15" },
  { id: 2, name: "Ahmed",     email: "ahmed@example.com",   role: "user",  createdAt: "2024-02-20" },
];

let userNextId = users.length + 1;

const products = [
  { id: 1, name: "Wireless Keyboard", category: "electronics", price: 200,  inStock: true,  stock: 42 },
  { id: 2, name: "Desk Lamp",         category: "furniture",   price: 300,  inStock: true,  stock: 15 },
  { id: 3, name: "USB",               category: "electronics", price: 400,  inStock: false, stock: 0  },
];
let productNextId = products.length + 1;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Express API Server",
    version: "1.0.0",
    endpoints: {
      "GET  /api/users":          "List all users",
      "GET  /api/users/:id":      "Get user by ID",
      "POST /api/users":          "Create a user  — body: { name, email, role? }",
      "DELETE /api/users/:id":    "Delete user by ID",
      "GET  /api/products":       "List products  — query: ?category=&inStock=",
      "GET  /api/products/:id":   "Get product by ID",
      "POST /api/products":       "Create a product — body: { name, category, price, stock? }",
    },
  });
});

// User Routes

// GET /api/users — list all
app.get("/api/users", (req, res) => {
  res.json({ success: true, count: users.length, data: users });
});

// GET /api/users/:id — single user
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: `User ${req.params.id} not found` });
  }
  res.json({ success: true, data: user });
});

// POST /api/users — create
app.post("/api/users", (req, res) => {
  const { name, email, role = "user" } = req.body;
  const errors = [];

  if (!name  || typeof name  !== "string") errors.push("'name' is required");
  if (!email || typeof email !== "string") errors.push("'email' is required");
  if (errors.length) return res.status(400).json({ success: false, errors });

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ success: false, error: "Email already exists" });
  }

  const newUser = {
    id: userNextId++,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role,
    createdAt: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);

  res.status(201).json({ success: true, message: "User created", data: newUser });
});

// DELETE /api/users/:id
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, error: `User ${req.params.id} not found` });
  }
  const deleted = users.splice(index, 1)[0];
  res.json({ success: true, message: `User '${deleted.name}' deleted`, data: deleted });
});

// Product routes

// GET /api/products — list all, with optional ?category= and ?inStock= filters
app.get("/api/products", (req, res) => {
  let result = [...products];

  if (req.query.category) {
    result = result.filter((p) => p.category === req.query.category.toLowerCase());
  }
  if (req.query.inStock !== undefined) {
    result = result.filter((p) => p.inStock === (req.query.inStock === "true"));
  }

  res.json({ success: true, count: result.length, filters: req.query, data: result });
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: `Product ${req.params.id} not found` });
  }
  res.json({ success: true, data: product });
});

// POST /api/products — create
app.post("/api/products", (req, res) => {
  const { name, category, price, stock = 0 } = req.body;
  const errors = [];

  if (!name     || typeof name     !== "string") errors.push("'name' is required");
  if (!category || typeof category !== "string") errors.push("'category' is required");
  if (price === undefined || typeof price !== "number" || price < 0) errors.push("'price' must be a non-negative number");
  if (typeof stock !== "number" || stock < 0) errors.push("'stock' must be a non-negative number");
  if (errors.length) return res.status(400).json({ success: false, errors });

  const newProduct = {
    id: productNextId++,
    name: name.trim(),
    category: category.toLowerCase().trim(),
    price: parseFloat(price.toFixed(2)),
    inStock: stock > 0,
    stock,
  };
  products.push(newProduct);

  res.status(201).json({ success: true, message: "Product created", data: newProduct });
});

// Key insight the positioning of middleware matters
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found", path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}\n`);
});