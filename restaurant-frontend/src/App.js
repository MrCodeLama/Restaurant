import React from "react";
import MenuTable from "./components/MenuTable";
import { Container, Typography } from "@mui/material";

function App() {
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Меню ресторану
            </Typography>
            <MenuTable />
        </Container>
    );
}

export default App;
