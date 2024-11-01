import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSessionTuneById } from "../services/sessionService";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import TuneSummaryCard from "../components/TuneSummaryCard";
import TuneSettingsList from "../components/TuneSettingsList";

const SessionDetailsPage = () => {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tune, setTune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("sessionfavourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Convert tuneId to string for consistent comparison
  const isFavorite = favorites.includes(String(tuneId));

  const handleToggleFavorite = useCallback(() => {
    setFavorites((prevFavorites) => {
      const tuneIdString = String(tuneId);
      let newFavorites;
      if (prevFavorites.includes(tuneIdString)) {
        // Remove from favorites
        newFavorites = prevFavorites.filter((id) => id !== tuneIdString);
      } else {
        // Add to favorites (prevent duplicates)
        newFavorites = [...prevFavorites, tuneIdString];
      }

      localStorage.setItem("sessionfavourites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, [tuneId]);

  // Listen for localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "sessionfavourites") {
        const newFavorites = e.newValue ? JSON.parse(e.newValue) : [];
        setFavorites(newFavorites);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchTuneDetails = async () => {
      try {
        setLoading(true);
        const data = await getSessionTuneById(tuneId);
        setTune(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tuneId) {
      fetchTuneDetails();
    }
  }, [tuneId]);

  const handleBackToSearch = () => {
    // If we came from search and have stored results, go back
    if (
      location.state?.fromSearch &&
      localStorage.getItem("lastSessionResults")
    ) {
      navigate(-1);
    } else {
      // Otherwise, just navigate to the main page
      navigate("/thesession");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!tune) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Tune not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button
          onClick={handleBackToSearch}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Search
        </Button>

        <TuneSummaryCard
          tune={tune}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
        />

        {tune?.settings && <TuneSettingsList settings={tune.settings} />}
      </Box>
    </Container>
  );
};

export default SessionDetailsPage;
