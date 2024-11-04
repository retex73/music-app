import React from "react";
import { Typography, Box, Grid, Button, useTheme } from "@mui/material";
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
        "&::before": {
          content: '""',
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: "150%",
          height: "100%",
          background: `radial-gradient(circle, ${theme.palette.primary.main}22 0%, transparent 70%)`,
          zIndex: -1,
        },
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Discover Irish Whistle Tunes
      </Typography>
      {/* ... rest of hero content ... */}
    </Box>
  );
};

export default Hero;
