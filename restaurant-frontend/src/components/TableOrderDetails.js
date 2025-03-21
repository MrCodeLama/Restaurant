import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../App.css";

const TableOrderDetails = () => {
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const {getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState([]); 


  const fetchOrderDetails = useCallback(() => {
    getAccessTokenSilently().then((token) => {
      axios
        .get(`http://localhost:8080/table-order-details?tableId=${tableId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setOrderItems(response.data))
        .catch((error) => console.error("Error fetching order details:", error));
    });
  }, [getAccessTokenSilently, tableId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  

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
  
  const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const handleItemClick = (index) => {
    setExpandedItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((itemIndex) => itemIndex !== index);
      }
      return [...prev, index];
    });
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h4" gutterBottom align="center">
        Деталі замовлення для столика {tableId}
      </Typography>
      {orderItems.length > 0 ? (
        <>
          <List sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {orderItems.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleItemClick(index)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 2,
                  alignItems: "center", // Центруємо контент всередині ListItem
                }}
              >
                <Typography variant="body1" sx={{ marginBottom: 1 }} align="center">
                  {item.name} - Кількість: {item.quantity} - Ціна {item.price} грн
                </Typography>
                {expandedItems.includes(index) && (
                  <Typography variant="body2" color="textSecondary" align="center">
                    Розрахунок: {item.quantity} x {item.price} = {item.quantity * item.price} грн
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" gutterBottom align="center">
            До сплати: {totalAmount} грн
          </Typography>
          <Button variant="contained" color="primary" onClick={handlePaymentConfirmation} sx={{ marginTop: 2 }}>
            Підтвердити оплату
          </Button>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          Немає активних замовлень для цього столика.
        </Typography>
      )}
    </Box>
  );
};

export default TableOrderDetails;
