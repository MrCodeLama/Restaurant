import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import TablesPage from "./components/TablesPage";
import TableOrderDetails from "./components/TableOrderDetails";
import CreateOrder from "./components/CreateOrder";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/table-order-details/:tableId" element={<TableOrderDetails />} />
        <Route path="/create-order/:tableId" element={<CreateOrder />} />
        <Route path="*" element={<MenuPage />} />
      </Routes>
    </Router>
  );
};

export default App;
