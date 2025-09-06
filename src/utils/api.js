const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function parseResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

async function request(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (opts.auth !== false) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  return parseResponse(res);
}

export async function apiGet(path, opts = {}) {
  return request(path, { method: "GET", ...opts });
}

export async function apiPost(path, body = {}, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  return request(path, { method: "POST", body: JSON.stringify(body), headers, ...opts });
}

export async function apiPostForm(path, formData, opts = {}) {
  // Do not set Content-Type for FormData (browser will set boundary)
  const headers = { ...(opts.headers || {}) };
  if (opts.auth !== false) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { method: "POST", body: formData, headers });
  return parseResponse(res);
}

export async function apiPut(path, body = {}, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  return request(path, { method: "PUT", body: JSON.stringify(body), headers, ...opts });
}

export async function apiDelete(path, opts = {}) {
  return request(path, { method: "DELETE", ...opts });
}

/* Products helpers */
export function addProduct(product) {
  if (product instanceof FormData) {
    return apiPostForm("/products", product);
  }
  return apiPost("/products", product);
}
export function addProductForm(formData) {
  return apiPostForm("/products", formData);
}
export function getAllProducts() {
  return apiGet("/products");
}
export function searchProducts(keyword) {
  return apiGet(`/products/search?keyword=${encodeURIComponent(keyword)}`);
}
export function getProductsByCategory(category) {
  return apiGet(`/products/category/${encodeURIComponent(category)}`);
}
export function getProductsBySeller(sellerId) {
  return apiGet(`/products/seller/${encodeURIComponent(sellerId)}`);
}
export function updateProduct(id, payload) {
  return apiPut(`/products/${encodeURIComponent(id)}`, payload);
}
export function deleteProduct(id) {
  return apiDelete(`/products/${encodeURIComponent(id)}`);
}

/* Auth */
export function signup(user) {
  return apiPost("/auth/signup", user, { auth: false });
}
export function login(credentials) {
  return apiPost("/auth/login", credentials, { auth: false });
}

/* Cart */
export function addToCart(cartItem) {
  return apiPost("/cart/add", cartItem);
}
export function getCart(userId) {
  return apiGet(`/cart/${encodeURIComponent(userId)}`);
}
export function removeFromCart(cartItemId) {
  return apiDelete(`/cart/remove/${encodeURIComponent(cartItemId)}`);
}

/* Purchases */
export function createPurchase(purchase) {
  return apiPost("/purchases", purchase);
}
export function getBuyerPurchases(userId) {
  return apiGet(`/purchases/buyer/${encodeURIComponent(userId)}`);
}
export function getSellerSales(userId) {
  return apiGet(`/purchases/seller/${encodeURIComponent(userId)}`);
}

/* User */
export function updateUser(userId, payload) {
  return apiPut(`/users/${encodeURIComponent(userId)}`, payload);
}