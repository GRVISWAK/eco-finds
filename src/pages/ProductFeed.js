import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductFeed.css";
import { getAllProducts, getProductsByCategory, addToCart } from "../utils/api";

const ProductFeed = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // add-to-cart states
  const [addingMap, setAddingMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setAllProducts(list);
      const cats = Array.from(new Set(list.map((p) => p.category).filter(Boolean))).sort();
      setCategories(cats);
      setActiveCategory("All");
    } catch (err) {
      console.error("Failed to load products", err);
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // apply filters
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (priceFilter !== "All") {
      switch (priceFilter) {
        case "<500":
          filtered = filtered.filter((p) => p.price < 500);
          break;
        case "500-1000":
          filtered = filtered.filter((p) => p.price >= 500 && p.price <= 1000);
          break;
        case "1000-5000":
          filtered = filtered.filter((p) => p.price > 1000 && p.price <= 5000);
          break;
        case "5000+":
          filtered = filtered.filter((p) => p.price > 5000);
          break;
        default:
          break;
      }
    }

    setProducts(filtered);
  }, [selectedCategory, priceFilter, allProducts]);

  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
    if (addingMap[product.id]) return;

    setAddingMap((m) => ({ ...m, [product.id]: true }));
    setError(null);

    const payload = {
      product: { id: product.id },
      user: { id: user.id },
      quantity: 1,
    };

    try {
      await addToCart(payload);
      setAddedMap((m) => ({ ...m, [product.id]: true }));
      setTimeout(() => {
        setAddedMap((m) => {
          const copy = { ...m };
          delete copy[product.id];
          return copy;
        });
      }, 2500);
    } catch (err) {
      console.error("Add to cart failed", err);
      setError(err?.message || "Failed to add to cart");
    } finally {
      setAddingMap((m) => {
        const copy = { ...m };
        delete copy[product.id];
        return copy;
      });
    }
  };

  return (
    <div className="product-feed container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Feed</h1>
          <div className="page-sub">Browse eco-friendly finds</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-panel">
        <div className="filter-item">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="price">Price</label>
          <select
            id="price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="<500">Below ₹500</option>
            <option value="500-1000">₹500 – ₹1000</option>
            <option value="1000-5000">₹1000 – ₹5000</option>
            <option value="5000+">Above ₹5000</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-muted">Loading products...</div>}
      {error && <div className="error" style={{ color: "var(--danger)" }}>{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="empty">No products found.</div>
      )}

      <div className="product-grid" style={{ marginTop: 12 }}>
        {products.map((product) => (
          <div key={product.id} className="card product-card">
            <div className="card-media">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title || "Product"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="no-image">No image</div>
              )}
            </div>

            <div className="card-body">
              <h3 className="card-title">{product.title}</h3>
              <div className="card-desc">{product.description}</div>

              <div className="card-row" style={{ marginTop: "auto" }}>
                <div>
                  <div className="price">
                    {product.price != null ? `$${Number(product.price).toFixed(2)}` : "—"}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {product.category || "Uncategorized"}
                  </div>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}
                >
                  <div className="badge">
                    Seller: {product.seller?.id ?? product.seller?.username ?? "—"}
                  </div>

                  <button
                    className={`btn add-cart-btn ${addingMap[product.id] ? "disabled" : ""}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={!!addingMap[product.id]}
                  >
                    {addingMap[product.id]
                      ? "Adding..."
                      : addedMap[product.id]
                      ? "Added"
                      : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeed;
