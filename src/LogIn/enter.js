import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Login"; // Import Admin Login Component
import AdminPanel from "../Admin/Admin"; // Import Admin Panel Component

const User = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPanel />} /> {/* Fix here */}
      </Routes>
    </Router>
  );
};

export default User;
