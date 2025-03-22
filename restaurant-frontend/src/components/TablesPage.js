import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all tables from the backend
    axios
      .get("http://localhost:8080/tables")
      .then((response) => setTables(response.data))
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  const handleTableClick = (tableId) => {
    // First, check if there's an order for the selected table
    axios
      .get(`http://localhost:8080/table-order-details?tableId=${tableId}`)
      .then((response) => {
        const orderExists = response.data && response.data.length > 0; // If order exists
        if (orderExists) {
          // Show order details for the table
          navigate(`/table-order-details/${tableId}`);
        } else {
          // No order exists, navigate to create order page
          navigate(`/create-order/${tableId}`);
        }
      })
      .catch((error) => console.error("Error checking order status:", error));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список столиків
      </Typography>
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
              onClick={() => handleTableClick(table.id)} // Handle table click
            >
              <Typography variant="h6">Столик {table.number}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TablesPage;
