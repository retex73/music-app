// src/components/FavoriteTunesList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { getTuneById } from "../services/tunesService";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation

function FavoriteTunesList() {
  const [favoriteTunes, setFavoriteTunes] = useState([]);

  useEffect(() => {
    const fetchFavoriteTunes = async () => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const tunes = await Promise.all(favorites.map((id) => getTuneById(id)));
      setFavoriteTunes(tunes);
    };

    fetchFavoriteTunes();
  }, []);

  if (favoriteTunes.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        No favorite tunes yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4, maxWidth: "250px", px: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
        Favorite Tunes
      </Typography>
      <List>
        {favoriteTunes.map((tune) => (
          <ListItem key={tune["Tune No."]} disablePadding>
            <ListItemButton
              component={Link}
              to={`/tune/${tune["Tune No."]}`}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                py: 1,
              }}
            >
              <ListItemText
                primary={tune["Tune Title"]}
                secondary={`Genre: ${tune["Genre"]}, Rhythm: ${tune["Rhythm"]}`}
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

export default FavoriteTunesList;
