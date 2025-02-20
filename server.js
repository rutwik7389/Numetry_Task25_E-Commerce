require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Add a new product
app.post("/products", (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const sql = "INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, description, price, category, stock], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// Fetch all products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Update a product
app.put("/products/:id", (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const sql = "UPDATE products SET name=?, description=?, price=?, category=?, stock=? WHERE id=?";
    db.query(sql, [name, description, price, category, stock, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product updated successfully" });
    });
});

// Delete a product
app.delete("/products/:id", (req, res) => {
    db.query("DELETE FROM products WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product deleted successfully" });
    });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
