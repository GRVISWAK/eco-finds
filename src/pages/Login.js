import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { apiPost } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiPost("/auth/login", formData, { auth: false });
      // debug
      console.log("login response:", response);

      // normalize id field (backend may return id / Id / userId)
      const normalized = { ...response, id: response?.id ?? response?.userId ?? response?.Id ?? null };

      if (!normalized || typeof normalized !== "object" || !normalized.id) {
        // backend returns 401 for invalid; parseResponse throws, but guard anyway
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(normalized));
      if (response.token) localStorage.setItem("token", response.token);

      // notify same-tab listeners
      window.dispatchEvent(new Event("authChanged"));

      navigate("/", { replace: true });
    } catch (err) {
      if (err && err.status === 401) setError("Invalid email or password");
      else setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
