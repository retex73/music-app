import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTuneById } from "../services/tunesService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import YouTube from "react-youtube";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../contexts/FavoritesContext";

function TuneDetailsPage() {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const [tune, setTune] = useState(null);
  const { hataoFavorites, toggleFavorite } = useFavorites();
  const isFavorite = hataoFavorites.includes(tuneId);

  useEffect(() => {
    const fetchTune = async () => {
      try {
        const tuneData = await getTuneById(tuneId);
        setTune(tuneData);
      } catch (error) {
        console.error("Error fetching tune details:", error);
      }
    };

    if (tuneId) {
      fetchTune();
    }
  }, [tuneId]);

  const handleToggleFavorite = () => {
    toggleFavorite(tuneId, "hatao");
  };

  if (!tune) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        aria-label="back to search"
      >
        Back to Search
      </Button>

      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary.main"
            >
              {tune["Tune Title"]}
            </Typography>
            <IconButton
              onClick={handleToggleFavorite}
              aria-label="toggle favorite"
            >
              {isFavorite ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip label={`Set ${tune["Set No."]}`} />
            <Chip label={`Tune ${tune["Tune No."]}`} />
            <Chip label={tune["Genre"]} />
          </Stack>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Musical Details
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`Rhythm: ${tune["Rhythm"]}`} variant="outlined" />
                <Chip label={`Key: ${tune["Key"]}`} variant="outlined" />
                <Chip label={`Mode: ${tune["Mode"]}`} variant="outlined" />
                <Chip label={`Parts: ${tune["Part"]}`} variant="outlined" />
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Added
              </Typography>
              <Typography>{tune["Added"]}</Typography>
            </Box>
          </Stack>

          {tune["Learning Video"] && (
            <Box sx={{ mb: 3 }}>
              <YouTube
                videoId={getVideoId(tune["Learning Video"])}
                opts={{
                  width: "100%",
                  height: "400",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayCircleOutlineIcon />}
            href={tune["Learning Video"]}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            sx={{
              py: 1.5,
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            Watch on YouTube
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TuneDetailsPage;
