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

function SessionFavoritesList() {
  const [favoriteTunes, setFavoriteTunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteTunes = async () => {
      const favorites =
        JSON.parse(localStorage.getItem("sessionfavourites")) || [];
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch full details for each favorite tune using the API
        const tunesPromises = favorites.map((id) => getSessionTuneById(id));
        const tunes = await Promise.all(tunesPromises);
        setFavoriteTunes(tunes);
      } catch (error) {
        console.error("Error fetching favorite tunes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTunes();

    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === "sessionfavourites") {
        fetchFavoriteTunes();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
        {favoriteTunes.map((tune) => (
          <ListItem key={tune.id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/thesession/tune/${tune.id}`}
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
