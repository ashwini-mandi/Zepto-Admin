import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Login";
import AdminPanel from "../Admin/Admin";
import Categories from "../Admin/Categories/categories"; // Import Categories
import Subcategories from "../Admin/SubCategories/subcategories"; // Ensure correct path
import Products from "../Admin/Products/products"; // Ensure correct paths
import Offers from "../Admin/Offers/offers"; // Ensure correct path

const User = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPanel />}>
          {/* Nested Routes inside AdminPanel */}
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<Subcategories />} />
          <Route path="products" element={<Products />} />
          <Route path="offers" element={<Offers />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default User;
