import React from "react";
import { Container, Box } from "@mui/material";
import Hero from "../components/Hero/Hero";
import FavoritesSection from "../components/FavoritesSection/FavoritesSection";
import Footer from "../components/Footer/Footer";

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
