import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation} from "react-router-dom";
import { Box, Typography, Button, List, ListItem, Checkbox, TextField, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../App.css";

const CreateOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); 
  const {getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    axios.get("http://localhost:8080/menu")
      .then(response => setMenuItems(response.data))
      .catch(error => console.error("Помилка отримання меню:", error));
  }, []);

  useEffect(() => {
    if (location.state?.editMode && location.state?.prefilled) {
      const prefilledItems = {};
      location.state.prefilled.forEach(item => {
        prefilledItems[item.id] = item.quantity;
      });
      setSelectedItems(prefilledItems);
    }
  }, [location]);

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

    console.log("Відправляємо запит:", requestData);
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
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Створення замовлення для столика {tableId}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={selectedItems[item.id] > 0}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      {item.name} - {item.price} грн
                    </Typography>
                  </Box>
                  {selectedItems[item.id] > 0 && (
                    <TextField
                      type="number"
                      value={selectedItems[item.id]}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      label="Кількість"
                      sx={{ width: 80 }}
                      inputProps={{ min: 1 }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrder}
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "16px",
            backgroundColor: "#66bb6a",
            "&:hover": { backgroundColor: "#4caf50" },
          }}
        >
          Підтвердити замовлення
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOrder;
