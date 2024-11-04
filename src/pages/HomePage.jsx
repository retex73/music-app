import React from "react";
import { Container, Box } from "@mui/material";
import Hero from "../components/HomePage/Hero";
import FavoritesSection from "../components/HomePage/FavoritesSection";
import Footer from "../components/HomePage/Footer";

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Hero />
        <FavoritesSection />
        <Footer />
      </Box>
    </Container>
  );
};

export default HomePage;
