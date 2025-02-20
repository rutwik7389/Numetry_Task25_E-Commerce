import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

const API_URL = "http://localhost:5000/products";

function App() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            fetchProducts();
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">E-Commerce Product Management</h1>

            <form className="product-form" onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                <button type="submit">Add Product</button>
            </form>

            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
