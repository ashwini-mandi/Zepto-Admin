import React, { useState } from "react";
import { Routes, Route, Link, Outlet, useLocation } from "react-router-dom";
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
    { path: "categories", label: "Categories", icon: FaFolder },
    { path: "subcategories", label: "Subcategories", icon: FaTags },
    { path: "products", label: "Products", icon: FaBox },
    { path: "offers", label: "Offers", icon: FaGift },
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
                location.pathname.includes(`/admin/${path}`) ? "bg-primary" : ""
              }`}
              to={`/admin/${path}`}
              onClick={() => setIsSidebarOpen(false)} // Auto-close in collapsed mode
            >
              <Icon className="me-2" /> {isSidebarOpen && label}
            </Link>
          ))}
        </Nav>
      </div>

      {/* Main Content - Ensure Outlet is used for nested routes */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "80px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
