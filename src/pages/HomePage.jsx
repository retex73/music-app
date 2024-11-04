import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import SessionFavoritesList from "../components/SessionFavoritesList";
import FavoriteTunesList from "../components/FavoriteTunesList";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

const HomePage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
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
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
          >
            Explore, learn, and play traditional Irish music with our curated
            collection of tin whistle tunes
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                component={RouterLink}
                to="/hatao"
                variant="contained"
                size="large"
                startIcon={<MusicNoteIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }}
              >
                Explore Hatao's Collection
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={RouterLink}
                to="/thesession"
                variant="outlined"
                size="large"
                startIcon={<LibraryMusicIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  "&:hover": {
                    borderColor: theme.palette.secondary.light,
                    background: `${theme.palette.secondary.main}11`,
                  },
                }}
              >
                Browse Session Tunes
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Favorites Section */}
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
      </Box>

      {/* Footer Section */}
      <Paper
        component="footer"
        elevation={0}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.paper}99)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Irish Whistle Tunes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your gateway to traditional Irish music.
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: { xs: "left", md: "center" } }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                component={RouterLink}
                to="/about"
                color="inherit"
                sx={{ justifyContent: "flex-start" }}
              >
                About
              </Button>
              <Button
                component={RouterLink}
                to="/privacy"
                color="inherit"
                sx={{ justifyContent: "flex-start" }}
              >
                Privacy Policy
              </Button>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: { xs: "left", md: "right" } }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Connect With Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <IconButton
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                href="mailto:contact@example.com"
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                mt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                pt: 2,
              }}
            >
              © {new Date().getFullYear()} Irish Whistle Tunes. All rights
              reserved.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HomePage;
