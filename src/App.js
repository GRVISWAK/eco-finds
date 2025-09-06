import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductFeed from "./pages/ProductFeed";
import AddProduct from "./pages/AddProduct";
import MyListings from "./pages/MyListings";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";
import Profile from "./pages/Profile";
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ProductFeed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;