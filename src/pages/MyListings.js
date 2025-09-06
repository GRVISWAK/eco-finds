import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProductsBySeller,
  deleteProduct,
  updateProduct,
} from "../utils/api";
import "./MyListings.css";

function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // product being edited
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Load listings
  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsBySeller(user.id);
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load listings", err);
      setError(err?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setListings((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    }
  };

  // Start edit
  const startEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  // Save edit
  const handleSave = async () => {
    try {
      const updated = await updateProduct(editingProduct, {
        ...formData,
        price: Number(formData.price),
      });
      setListings((prev) =>
        prev.map((p) => (p.id === editingProduct ? updated : p))
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update product");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      imageUrl: "",
    });
  };

  return (
    <div className="my-listings container">
      <h1>My Listings</h1>

      {loading && <div className="text-muted">Loading your listings...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && listings.length === 0 && (
        <div className="empty">You have no listings yet.</div>
      )}

      <ul className="listings-grid">
        {listings.map((p) => (
          <li key={p.id} className="listing-item card">
            <div className="card-media">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder.png")
                  }
                />
              ) : (
                <div className="no-image">No image</div>
              )}
            </div>

            <div className="card-body">
              {editingProduct === p.id ? (
                <>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />

                  <div className="actions">
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-ghost" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="card-title">{p.title}</h3>
                  <div className="card-desc">{p.description}</div>
                  <div className="price">
                    ₹{p.price != null ? Number(p.price).toFixed(2) : "—"}
                  </div>
                  <div className="text-muted">
                    {p.category || "Uncategorized"}
                  </div>

                  <div className="actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyListings;
