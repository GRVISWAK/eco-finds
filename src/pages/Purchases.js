import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuyerPurchases } from "../utils/api";
import "./Purchases.css";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBuyerPurchases(user.id);
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch purchases", err);
        setError(err?.message || "Failed to load purchases");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="purchases-container container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Your Purchases</h1>
      </div>

      {loading && <div className="text-muted">Loading purchases...</div>}
      {error && <div className="error" style={{ color: "var(--danger)" }}>{error}</div>}

      {!loading && !error && purchases.length === 0 && (
        <div className="empty">You have not purchased any items yet.</div>
      )}

      <div className="product-grid" style={{ marginTop: 12 }}>
        {purchases.map((p) => {
          const prod = p.product || {};
          const seller = p.seller || {};
          const ts = p.timestamp ? new Date(p.timestamp).toLocaleString() : null;

          return (
            <div key={p.id} className="card">
              <div className="card-media">
                {prod.imageUrl ? (
                  <img src={prod.imageUrl} alt={prod.title} onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                    No image
                  </div>
                )}
              </div>

              <div className="card-body">
                <h3 className="card-title">{prod.title}</h3>
                <div className="card-desc">{prod.description}</div>

                <div className="card-row" style={{ marginTop: "auto" }}>
                  <div>
                    <div className="price">{prod.price != null ? `$${Number(prod.price).toFixed(2)}` : "—"}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{prod.category || "Uncategorized"}</div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="text-muted" style={{ fontSize: 12 }}>Seller: {seller.username ?? seller.id ?? "—"}</div>
                    {ts && <div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>{ts}</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Purchases;