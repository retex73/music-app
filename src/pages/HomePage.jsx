import React from "react";
import { Container, Box } from "@mui/material";
import Hero from "../components/HomePage/Hero";
import FavoritesSection from "../components/HomePage/FavoritesSection";
import Footer from "../components/HomePage/Footer";
import RandomTunes from "../components/HomePage/RandomTunes";

const HomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        <Box sx={{ py: 8 }}>
          <Hero />
          <FavoritesSection />
          <Box sx={{ mb: 4 }} />
          <RandomTunes />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
