import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, List, ListItem, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const CreateOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); 
  const {getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    axios.get("http://localhost:8080/menu")
      .then(response => setMenuItems(response.data))
      .catch(error => console.error("Помилка отримання меню:", error));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id]; 
      } else {
        updated[id] = 1; 
      }
      return updated;
    });
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (quantity > 0) {
        updated[id] = quantity;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const handleCreateOrder = () => {
    if (Object.keys(selectedItems).length === 0) {
      alert("Оберіть хоча б одну страву!");
      return;
    }

    const requestData = {
      tableId: parseInt(tableId, 10),
      menuItemIds: Object.keys(selectedItems).map((key) => ({
        menuItemId: parseInt(key),
        quantity: selectedItems[key],
      })),
    };

    console.log("🔍 Відправляємо запит:", requestData);
    getAccessTokenSilently().then((token) => {
      axios.post("http://localhost:8080/create-order", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Замовлення створене!");
        navigate("/tables");
      })
      .catch(error => console.error("Помилка створення замовлення:", error));})
    
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Створення замовлення для столика {tableId}
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={selectedItems[item.id] > 0}
              onChange={() => handleCheckboxChange(item.id)}
            />
            {item.name} - {item.price} грн
            {selectedItems[item.id] > 0 && (
              <TextField
                type="number"
                value={selectedItems[item.id]}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                label="Кількість"
                sx={{ marginLeft: 2, width: 80 }}
                inputProps={{ min: 1 }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleCreateOrder}>
        Підтвердити замовлення
      </Button>
    </Box>
  );
};

export default CreateOrder;
