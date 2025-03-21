import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import MenuPage from "./components/MenuPage";
import TablesPage from "./components/TablesPage";
import TableOrderDetails from "./components/TableOrderDetails";
import CreateOrder from "./components/CreateOrder";

import "./App.css";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const namespace = "https://restaurantBackend.com";
      const userRole = user?.[`${namespace}/role`];
      setRole(userRole || ""); // Якщо ролі немає, встановити порожнє значення
    }
  }, [isAuthenticated, user]);

  const isAdmin = role === "admin";

  return (
    <Router>
      {/* Верхня панель з кнопкою входу */}
      <AppBar position="static">
        <Toolbar>
        <Typography 
      variant="h6" 
      sx={{ flexGrow: 1, cursor: "pointer", textDecoration: "none", color: "inherit" }} 
      component={Link} 
      to="/"
    >
            Меню ресторану
          </Typography>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/tables">
                  Столики
                </Button>
              )}
              <Button color="inherit" onClick={() => logout()}>
                Вийти
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Вхід
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/tables" element={<ProtectedRoute element={<TablesPage />} />} />
        <Route path="/table-order-details/:tableId" element={<ProtectedRoute element={<TableOrderDetails />} />} />
        <Route path="/create-order/:tableId" element={<ProtectedRoute element={<CreateOrder />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
