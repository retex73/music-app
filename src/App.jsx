import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TuneDetailsPage from "./pages/TuneDetailsPage";
import TheSessionPage from "./pages/TheSessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import HataoPage from "./pages/HataoPage";
import CataloguePage from "./pages/CataloguePage";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme/darkTheme";
import NavBar from "./components/NavBar";
import { Box } from "@mui/material";
import TheSessionTuneDetailsPage from "./pages/TheSessionTuneDetailsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <NavBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hatao" element={<HataoPage />} />
                <Route path="/tune/:tuneId" element={<TuneDetailsPage />} />
                <Route path="/thesession" element={<TheSessionPage />} />
                <Route path="/catalogue" element={<CataloguePage />} />
                <Route
                  path="/thesession/tune/:tuneId"
                  element={<TheSessionTuneDetailsPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Box>
          </Box>
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
