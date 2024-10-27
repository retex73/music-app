import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { initializeTunesData, searchTunes } from "../services/tunesService";
// Add these imports
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await initializeTunesData();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSearch = (query) => {
    setHasSearched(true);
    const results = searchTunes(query);
    setSearchResults(results);
    if (!query.trim()) {
      setHasSearched(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Irish Tune Search
        </Typography>
        <SearchBar onSearch={handleSearch} />
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SearchResults results={searchResults} hasSearched={hasSearched} />
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
