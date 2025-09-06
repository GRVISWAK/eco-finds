import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    const refresh = () => {
      try { setUser(JSON.parse(localStorage.getItem("user") || "null")); } catch { setUser(null); }
    };
    const onStorage = (e) => { if (e.key === "user") refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", refresh);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="nav-brand">EcoFinds</Link>
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-link">Products</Link>

        {user && user.id ? (
          <>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/add-product" className="nav-link">Add Product</Link>
            <Link to="/my-listings" className="nav-link">My Products</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-link btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}