import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [tune, setTune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("sessionfavourites");
    return saved ? JSON.parse(saved) : [];
  });

  const handleToggleFavorite = useCallback(() => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(tuneId)
        ? prevFavorites.filter((id) => id !== tuneId)
        : [...prevFavorites, tuneId];

      localStorage.setItem("sessionfavourites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, [tuneId]);

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
          onClick={() => navigate("/thesession")}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Search
        </Button>

        <TuneSummaryCard
          tune={tune}
          isFavorite={favorites.includes(tuneId)}
          onToggleFavorite={handleToggleFavorite}
        />

        {tune?.settings && <TuneSettingsList settings={tune.settings} />}
      </Box>
    </Container>
  );
};

export default SessionDetailsPage;
