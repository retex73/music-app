import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionTuneById } from "../services/sessionService";
import { tunePreferencesService } from "../services/tunePreferencesService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReorderIcon from "@mui/icons-material/Reorder";
import TuneSettingsList from "../components/TheSessionTuneDetailsPage/TuneSettingsList";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";

function TheSessionTuneDetailsPage() {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const { sessionFavorites, toggleFavorite } = useFavorites();
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const isFavorite = sessionFavorites.includes(tuneId);

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

        if (currentUser) {
          const preferences = await tunePreferencesService.getTunePreferences(
            currentUser.uid,
            tuneId
          );

          if (preferences.versionOrder && preferences.versionOrder.length > 0) {
            // Create a map for O(1) lookup of position
            const orderMap = new Map(
              preferences.versionOrder.map((id, index) => [id, index])
            );

            formattedSettings.sort((a, b) => {
              const aIndex = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
              const bIndex = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
              return aIndex - bIndex;
            });
          }
        }

        setSettings(formattedSettings);
      } catch (error) {
        console.error("Error fetching tune details:", error);
      }
    };

    if (tuneId) {
      fetchTune();
    }
  }, [tuneId, currentUser]);

  const handleToggleFavorite = () => {
    toggleFavorite(tuneId, "session");
  };

  const handleVersionMenuClick = (event, setting) => {
    setAnchorEl(event.currentTarget);
    setSelectedSetting(setting);
  };

  const handleVersionMenuClose = () => {
    setAnchorEl(null);
    setSelectedSetting(null);
  };

  const handleSetPreferredVersion = async (position) => {
    if (!currentUser || !selectedSetting) return;

    const currentIndex = settings.findIndex((s) => s.id === selectedSetting.id);
    if (currentIndex === -1) return;

    const newSettings = [...settings];
    const [removed] = newSettings.splice(currentIndex, 1);
    newSettings.splice(position, 0, removed);
    setSettings(newSettings);

    // Save the new order to Firebase
    const versionOrder = newSettings.map((s) => s.id);
    await tunePreferencesService.saveTunePreferences(
      currentUser.uid,
      tuneId,
      versionOrder
    );

    handleVersionMenuClose();
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
            <Chip label={firstSetting.type} />
            <Chip label={`${firstSetting.meter}`} />
            <Chip label={firstSetting.mode} />
          </Stack>

          <List>
            {settings.map((setting, index) => (
              <ListItem
                key={setting.id}
                secondaryAction={
                  currentUser && (
                    <IconButton
                      edge="end"
                      aria-label="reorder"
                      onClick={(e) => handleVersionMenuClick(e, setting)}
                    >
                      <ReorderIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={`Version ${index + 1} by ${setting.username}`}
                  secondary={`Added on ${new Date(
                    setting.date
                  ).toLocaleDateString()}`}
                />
                <TuneSettingsList settings={[setting]} />
              </ListItem>
            ))}
          </List>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleVersionMenuClose}
          >
            {settings.map((_, index) => (
              <MenuItem
                key={index}
                onClick={() => handleSetPreferredVersion(index)}
              >
                Move to position {index + 1}
              </MenuItem>
            ))}
          </Menu>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TheSessionTuneDetailsPage;
