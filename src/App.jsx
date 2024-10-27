import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TuneDetailsPage from "./pages/TuneDetailsPage";
import TheSessionPage from "./pages/TheSessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme/darkTheme";
import NavBar from "./components/NavBar";
import { Box } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tune/:tuneId" element={<TuneDetailsPage />} />
            <Route path="/thesession" element={<TheSessionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
