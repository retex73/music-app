import React from "react";
import { Typography, Paper, Grid, useTheme } from "@mui/material";
import FavoriteTunesList from "../FavoriteTunesList";
import SessionFavoritesList from "../SessionFavoritesList";

const FavoritesSection = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.paper}99)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 4,
          color: theme.palette.primary.main,
        }}
      >
        Your Favorite Tunes
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <FavoriteTunesList />
        </Grid>
        <Grid item xs={12} md={6}>
          <SessionFavoritesList />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FavoritesSection;
