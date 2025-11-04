import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme/darkTheme";
import NavBar from "./components/NavBar";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

// Lazy load all route components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const HataoPage = lazy(() => import("./pages/HataoPage"));
const TuneDetailsPage = lazy(() => import("./pages/TuneDetailsPage"));
const CataloguePage = lazy(() => import("./pages/CataloguePage"));
const TheSessionPage = lazy(() => import("./pages/TheSessionPage"));
const TheSessionTuneDetailsPage = lazy(() => import("./pages/TheSessionTuneDetailsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

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
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </Box>
          </Box>
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
