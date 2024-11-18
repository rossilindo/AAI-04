import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import SupplierList from "./components/SupplierList";
import History from "./components/History"; // Importa a página de histórico

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-4 bg-gray-900 overflow-hidden">
      <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/" element={<History />} /> {/* Nova rota */}
          <Route path="/history" element={<History />} /> {/* Nova rota */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
