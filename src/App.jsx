import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TuneDetailsPage from "./pages/TuneDetailsPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tune/:tuneId" element={<TuneDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
