import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionTuneById } from "../services/sessionService";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TuneSettingsList from "../components/TheSessionTuneDetailsPage/TuneSettingsList";

function TheSessionTuneDetailsPage() {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTune = async () => {
      try {
        const tuneSettings = await getSessionTuneById(tuneId);
        const formattedSettings = tuneSettings.map((setting) => ({
          id: setting.setting_id,
          key: setting.mode,
          abc: setting.abc,
          date: setting.date,
          username: setting.username,
          name: setting.name,
          type: setting.type,
          meter: setting.meter,
          mode: setting.mode,
        }));
        setSettings(formattedSettings);
      } catch (error) {
        console.error("Error fetching tune details:", error);
      }
    };

    if (tuneId) {
      fetchTune();
    }
  }, [tuneId]);

  useEffect(() => {
    const favorites =
      JSON.parse(localStorage.getItem("sessionfavourites")) || [];
    setIsFavorite(favorites.includes(tuneId));
  }, [tuneId]);

  const toggleFavorite = () => {
    const favorites =
      JSON.parse(localStorage.getItem("sessionfavourites")) || [];
    if (isFavorite) {
      const updatedFavorites = favorites.filter((id) => id !== tuneId);
      localStorage.setItem(
        "sessionfavourites",
        JSON.stringify(updatedFavorites)
      );
    } else {
      favorites.push(tuneId);
      localStorage.setItem("sessionfavourites", JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  if (!settings.length) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const firstSetting = settings[0];

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Button
        onClick={() => navigate("/thesession")}
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
              {firstSetting.name}
            </Typography>
            <IconButton onClick={toggleFavorite} aria-label="toggle favorite">
              {isFavorite ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip label={firstSetting.type} />
            <Chip label={`${firstSetting.meter}`} />
            <Chip label={firstSetting.mode} />
          </Stack>

          <TuneSettingsList settings={settings} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default TheSessionTuneDetailsPage;
