import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const TableOrderDetails = () => {
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    // Fetch the order details for the selected table
    axios
      .get(`http://localhost:8080/table-order-details?tableId=${tableId}`)
      .then((response) => setOrderItems(response.data))
      .catch((error) => console.error("Error fetching order details:", error));
  }, [tableId]);

  const handlePaymentConfirmation = () => {
    // Handle payment confirmation logic here
    console.log("Confirming payment for table:", tableId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Деталі замовлення для столика {tableId}
      </Typography>
      <List>
        {orderItems.map((item, index) => (
          <ListItem key={index}>
            {item.name} - Кількість: {item.quantity}
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handlePaymentConfirmation}>
        Підтвердити оплату
      </Button>
    </Box>
  );
};

export default TableOrderDetails;
