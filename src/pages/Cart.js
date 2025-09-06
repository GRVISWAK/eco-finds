import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, createPurchase } from "../utils/api";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseLoadingMap, setPurchaseLoadingMap] = useState({}); // { [cartItemId]: true }
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart(user.id);
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setError(err?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item", err);
      setError(err?.message || "Failed to remove item");
    }
  };

  // Purchase a single cart item
  const handlePurchase = async (cartItem) => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const id = cartItem.id;
    if (purchaseLoadingMap[id]) return;

    setPurchaseLoadingMap((m) => ({ ...m, [id]: true }));
    setError(null);

    const product = cartItem.product || {};
    const sellerId = product?.seller?.id ?? product?.sellerId ?? null;

    const payload = {
      buyer: { id: user.id },
      product: { id: product.id },
      seller: sellerId ? { id: sellerId } : null,
    };

    try {
      await createPurchase(payload);
      // remove from cart after successful purchase
      await removeFromCart(id);
      setCartItems((items) => items.filter((it) => it.id !== id));
      // navigate to purchases page to reflect the new purchase
      navigate("/purchases");
    } catch (err) {
      console.error("Purchase failed", err);
      setError(err?.message || "Failed to create purchase");
    } finally {
      setPurchaseLoadingMap((m) => {
        const copy = { ...m };
        delete copy[id];
        return copy;
      });
    }
  };

  // Checkout all items in cart sequentially
  const handleCheckoutAll = async () => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      for (const cartItem of cartItems.slice()) {
        const product = cartItem.product || {};
        const sellerId = product?.seller?.id ?? product?.sellerId ?? null;
        const payload = {
          buyer: { id: user.id },
          product: { id: product.id },
          seller: sellerId ? { id: sellerId } : null,
        };

        try {
          await createPurchase(payload);
          await removeFromCart(cartItem.id);
          setCartItems((items) => items.filter((it) => it.id !== cartItem.id));
        } catch (innerErr) {
          console.error("Failed to purchase item", cartItem, innerErr);
          // continue with next items but surface the error
          setError(innerErr?.message || "Some purchases failed");
        }
      }

      // after processing all, go to purchases page
      navigate("/purchases");
    } catch (err) {
      console.error("Checkout failed", err);
      setError(err?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h1 className="page-title">Your Cart</h1>
        {cartItems.length > 0 && (
          <div>
            <button className="btn btn-primary" onClick={handleCheckoutAll} disabled={loading}>
              {loading ? "Processing..." : "Checkout All"}
            </button>
          </div>
        )}
      </div>

      {loading && <div className="text-muted">Loading cart...</div>}
      {error && <div className="error" style={{ color: "var(--danger)" }}>{error}</div>}

      {!loading && cartItems.length === 0 && <div className="empty">Your cart is empty.</div>}

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div key={item.id} className="card cart-item">
            <div className="card-media">
              {item.product?.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="no-image">No image</div>
              )}
            </div>

            <div className="card-body">
              <h3 className="card-title">{item.product?.title}</h3>
              <div className="price">
                {item.product?.price != null ? `$${Number(item.product.price).toFixed(2)}` : "—"}
              </div>
              <div className="text-muted">{item.product?.category}</div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => handlePurchase(item)}
                  disabled={!!purchaseLoadingMap[item.id]}
                >
                  {purchaseLoadingMap[item.id] ? "Purchasing..." : "Buy"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
