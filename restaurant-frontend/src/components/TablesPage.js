import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const TablesPage = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          axios
            .get("http://localhost:8080/tables", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => setTables(response.data))
            .catch((error) => console.error("Error fetching tables:", error));
        })
        .catch((error) => console.error("Error getting access token:", error));
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleTableClick = (tableId) => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          axios
            .get(`http://localhost:8080/table-order-details?tableId=${tableId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const orderExists = response.data && response.data.length > 0;
              if (orderExists) {
                navigate(`/table-order-details/${tableId}`);
              } else {
                navigate(`/create-order/${tableId}`);
              }
            })
            .catch((error) => console.error("Error checking order status:", error));
        })
        .catch((error) => console.error("Error getting access token:", error));
    }
  };

  // Перевірка, чи є користувач адміністратором
  const isAdmin = user && user.role === "admin"; // Тут вказуємо роль, яку має адміністратор

  // Якщо користувач не авторизований або ще завантажується дані, можна відобразити завантаження
  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!isAuthenticated) {
    return <div>Ви не авторизовані. Будь ласка, увійдіть як адміністратор.</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список столиків
      </Typography>
      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-order/1")} // Приклад переходу на створення замовлення
          sx={{ marginBottom: 2 }}
        >
          Додати нове замовлення
        </Button>
      )}
      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid item key={table.id} xs={6} sm={4} md={3} lg={2}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
              onClick={() => handleTableClick(table.id)}
            >
              <Typography variant="h6">Столик {table.number}</Typography>
              <Typography variant="body2" color="textSecondary">
                {table.hasOrder ? "Є замовлення" : "Немає замовлення"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TablesPage;
