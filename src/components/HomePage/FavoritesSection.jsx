import React from "react";
import { Typography, Paper, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FavoriteTunesList from "../FavoriteTunesList";
import SessionFavoritesList from "../SessionFavoritesList";

const FavoritesSection = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
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
      <Grid
        container
        spacing={4}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center", // Center the content horizontally
            "& > *": {
              width: "100%",
              maxWidth: "600px", // Optional: prevents lists from getting too wide
            },
          }}
        >
          <FavoriteTunesList />
        </Grid>
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center", // Center the content horizontally
            "& > *": {
              width: "100%",
              maxWidth: "600px", // Optional: prevents lists from getting too wide
            },
          }}
        >
          <SessionFavoritesList />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FavoritesSection;
