import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TuneDetailsPage from "./pages/TuneDetailsPage";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme/darkTheme";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tune/:tuneId" element={<TuneDetailsPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;