import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getSessionTuneById } from "../services/sessionService";
import { useFavorites } from "../contexts/FavoritesContext";

function SessionFavoritesList() {
  const [favoriteTunes, setFavoriteTunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sessionFavorites } = useFavorites();

  useEffect(() => {
    const fetchFavoriteTunes = async () => {
      if (sessionFavorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch full details for each favorite tune using the API
        const tunesPromises = sessionFavorites.map((id) =>
          getSessionTuneById(id)
        );
        const tunesArrays = await Promise.all(tunesPromises);
        // Take the first setting of each tune
        const tunes = tunesArrays.map((settings) => settings[0]);
        setFavoriteTunes(tunes);
      } catch (error) {
        console.error("Error fetching favorite tunes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTunes();
  }, [sessionFavorites]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (favoriteTunes.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        No favorite session tunes yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4, maxWidth: "250px", px: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
        Favorite Session Tunes
      </Typography>
      <List>
        {favoriteTunes.map((tune, index) => (
          <ListItem
            key={tune.tune_id ? String(tune.tune_id) : `tune-${index}`}
            disablePadding
          >
            <ListItemButton
              component={Link}
              to={`/thesession/tune/${tune.tune_id}`}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                py: 1,
              }}
            >
              <ListItemText
                primary={tune.name}
                secondary={tune.type}
                primaryTypographyProps={{
                  color: "primary.main",
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default SessionFavoritesList;
