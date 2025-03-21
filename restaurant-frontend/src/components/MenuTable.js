import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import axios from "axios";

const MenuTable = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8080/menu")
            .then(response => {
                setMenuItems(response.data);

                // Отримуємо унікальні категорії
                const uniqueCategories = [...new Set(response.data.map(item => item.category))];
                setCategories(uniqueCategories);
            })
            .catch(error => console.error("Помилка отримання меню:", error));
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 4 }}>
            <Tabs 
                value={selectedCategory} 
                onChange={(event, newValue) => setSelectedCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                {categories.map((category, index) => (
                    <Tab key={index} label={category} />
                ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
                {menuItems
                    .filter(item => item.category === categories[selectedCategory])
                    .map((item) => (
                        <Box key={item.id} sx={{ p: 2, border: "1px solid #ccc", mb: 2, borderRadius: 2 }}>
                            <Typography variant="h6">{item.name} - {item.price} грн</Typography>
                            <Typography variant="body2">{item.description}</Typography>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
};

export default MenuTable;
