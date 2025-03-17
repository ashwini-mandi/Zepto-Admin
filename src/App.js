import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./Admin/Admin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
