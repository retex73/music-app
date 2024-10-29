import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionTuneById } from "../services/sessionService";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

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

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h4" component="h1" color="primary.main">
                {tune.name}
              </Typography>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{
                  color: favorites.includes(tuneId) ? "error.main" : "inherit",
                }}
              >
                {favorites.includes(tuneId) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Stack>

            <Stack spacing={3}>
              {tune.type && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Type
                  </Typography>
                  <Chip label={tune.type} />
                </Box>
              )}

              {tune.settings && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Settings
                  </Typography>
                  <Typography>{tune.settings.length} versions</Typography>
                </Box>
              )}

              {tune.date && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Added
                  </Typography>
                  <Typography>
                    {new Date(tune.date).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<PlayCircleOutlineIcon />}
              href={tune.url}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              View on TheSession
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SessionDetailsPage;
