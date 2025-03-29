import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography, Grid, Paper, Divider } from "@mui/material";

import axios from "axios";
import "../App.css";

const MenuPage  = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8080/menu")
            .then(response => {
                setMenuItems(response.data);
                const uniqueCategories = [...new Set(response.data.map(item => item.category))];
                setCategories(uniqueCategories);
            })
            .catch(error => console.error("Помилка отримання меню:", error));
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
                <Tabs 
                    value={selectedCategory} 
                    onChange={(event, newValue) => setSelectedCategory(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="menu categories"
                    sx={{
                        bgcolor: "rgb(196, 196, 196)", // Change background color for unselected tabs
                        color: "white",
                        borderRadius: "8px",
                        boxShadow: 2,
                        mb: 3,
                    }}
                >
                    {categories.map((category, index) => (
                        <Tab 
                            key={index} 
                            label={category} 
                            sx={{
                                textTransform: 'none', 
                                fontWeight: 'bold',
                                color: selectedCategory === index ? "white" : "rgb(255, 255, 255)", 
                                bgcolor: "transparent", 
                                '&:hover': {
                                    bgcolor:"rgba(255, 255, 255, 0.2)",
                                },
                            }}
                        />
                    ))}
                </Tabs>

                <Grid container spacing={3}>
                    {menuItems
                        .filter(item => item.category === categories[selectedCategory])
                        .map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Paper 
                                    sx={{
                                        padding: 2, 
                                        borderRadius: 2, 
                                        boxShadow: 3, 
                                        transition: '0.3s', 
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {item.name} - {item.price} грн
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                                        {item.description}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Paper>
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default MenuPage ;
