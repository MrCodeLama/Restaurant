import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const TableOrderDetails = () => {
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const {getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [tableId]);

  const fetchOrderDetails = () => {
    getAccessTokenSilently().then((token) => {
      axios
      .get(`http://localhost:8080/table-order-details?tableId=${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setOrderItems(response.data))
      .catch((error) => console.error("Error fetching order details:", error));
    })
    
  };

  const handlePaymentConfirmation = () => {
    getAccessTokenSilently().then((token) => {
      axios
      .post(`http://localhost:8080/confirm-payment?tableId=${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setOrderItems([]);
        alert("Оплата підтверджена, замовлення видалено!");
        navigate("/tables");
      })
      .catch((error) => {
        console.error("Error confirming payment:", error);
        alert("Помилка при підтвердженні оплати!");
      });
    })
  
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Деталі замовлення для столика {tableId}
      </Typography>
      {orderItems.length > 0 ? (
        <>
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
        </>
      ) : (
        <Typography variant="h6" color="textSecondary">
          Немає активних замовлень для цього столика.
        </Typography>
      )}
    </Box>
  );
};

export default TableOrderDetails;
