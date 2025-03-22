import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateOrder = () => {
  const { tableId } = useParams();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch menu items for the table
    axios
      .get("http://localhost:8080/menu")
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  const handleCreateOrder = () => {
    // Handle the order creation logic here
    console.log("Creating order for table:", tableId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Створення замовлення для столика {tableId}
      </Typography>
      <Grid container spacing={2}>
        {menuItems.map((item) => (
          <Grid item key={item.id} xs={6} sm={4} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
              <Typography variant="body1">Ціна: {item.price} грн</Typography>
              <Button variant="contained" color="primary" onClick={handleCreateOrder}>
                Додати до замовлення
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleCreateOrder}>
        Підтвердити замовлення
      </Button>
    </Box>
  );
};

export default CreateOrder;
