import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../App.css";

const TablesPage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
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
  }, [isAuthenticated, getAccessTokenSilently, user]);

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

  if (!isAuthenticated) {
    return <div>Ви не авторизовані або у вас немає прав адміністратора.</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Список столиків
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {tables.map((table) => (
          <Grid item key={table.id} xs={12} sm={6} md={4} lg={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  transform: "scale(1.05)",
                },
                border: `1px solid ${table.hasOrder ? "#66bb6a" : "#ff7043"}`, // Green for "hasOrder" and red for "noOrder"
              }}
              onClick={() => handleTableClick(table.id)}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: table.hasOrder ? '#66bb6a' : '#ff7043' }}>
                Столик {table.number}
              </Typography>
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
