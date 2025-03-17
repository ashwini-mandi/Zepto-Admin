import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTimes,
  FaFolder,
  FaTags,
  FaBox,
  FaGift,
  FaUserShield,
  FaBars,
} from "react-icons/fa";
import Categories from "./Categories/categories";

const Subcategories = () => <h2>Manage Subcategories</h2>;
const Products = () => <h2>Manage Products</h2>;
const Offers = () => <h2>Manage Offers</h2>;

const AdminPanel = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin/categories", label: "Categories", icon: FaFolder },
    { path: "/admin/subcategories", label: "Subcategories", icon: FaTags },
    { path: "/admin/products", label: "Products", icon: FaBox },
    { path: "/admin/offers", label: "Offers", icon: FaGift },
  ];

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div
        className="bg-dark text-white d-flex flex-column p-3 position-fixed h-100 shadow"
        style={{
          width: isSidebarOpen ? "250px" : "80px",
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            {isSidebarOpen && (
              <>
                <FaUserShield size={24} />
                <span className="ms-2 fs-5">Admin</span>
              </>
            )}
          </div>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <Nav className="flex-column">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              className={`nav-link text-white d-flex align-items-center p-2 rounded ${
                location.pathname === path ? "bg-primary" : ""
              }`}
              to={path}
              onClick={() => setIsSidebarOpen(false)} // Auto-close in collapsed mode
            >
              <Icon className="me-2" /> {isSidebarOpen && label}
            </Link>
          ))}
        </Nav>
      </div>

      {/* Main Content - Ensure content is cleared when navigating */}
      <div
        key={location.pathname} // Forces React to re-render the component
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "80px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/subcategories" element={<Subcategories />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/offers" element={<Offers />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
