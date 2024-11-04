import React from "react";
import { Typography, Box, Button, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link as RouterLink } from "react-router-dom";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 8,
        position: "relative",
        padding: "4rem 1rem",
        backgroundImage: 'url("/images/hero-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backgroundBlendMode: "overlay",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          mb: 3,
        }}
      >
        Discover Irish Whistle Tunes
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{
          mb: 6,
          maxWidth: "800px",
          mx: "auto",
          color: "white",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        Explore our collection of traditional Irish music, from jigs and reels
        to hornpipes and airs
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        <Grid xs="auto">
          <Button
            component={RouterLink}
            to="/hatao"
            variant="contained"
            size="large"
            startIcon={<MusicNoteIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Hatao's Tune a Day
          </Button>
        </Grid>
        <Grid xs="auto">
          <Button
            component={RouterLink}
            to="/thesession"
            variant="outlined"
            size="large"
            startIcon={<LibraryMusicIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "translateY(-2px)",
              },
            }}
          >
            Browse The Session
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
