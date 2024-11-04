import {
  Paper,
  Box,
  Button,
  Typography,
  Container,
  Stack,
  IconButton,
} from "@mui/material";

import Grid from "@mui/material/Grid2";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <Paper
      sx={{
        mt: "auto",
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: "background.default",
        borderTop: 1,
        borderColor: "divider",
      }}
      component="footer"
      square
      elevation={0}
    >
      <Container
        maxWidth="lg"
        sx={{
          maxWidth: { xs: "100%", sm: "600px", md: "900px", lg: "1200px" },
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            py: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              IrishWhistleTunes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learn and discover traditional Irish whistle music
            </Typography>
          </Box>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ maxWidth: { xs: "100%", md: "60%" } }}
          >
            <Grid xs={12} sm={3}>
              <Button href="/about" color="inherit" size="small">
                About
              </Button>
            </Grid>
            <Grid xs={12} sm={3}>
              <Button href="/privacy" color="inherit" size="small">
                Privacy
              </Button>
            </Grid>
            <Grid xs={12} sm={3}>
              <Button href="/terms" color="inherit" size="small">
                Terms
              </Button>
            </Grid>
            <Grid xs={12} sm={3}>
              <Button href="/contact" color="inherit" size="small">
                Contact
              </Button>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2}>
            <IconButton
              href="https://github.com/yourusername/irish-whistle-tunes"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              size="small"
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com/irishwhistletunes"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              size="small"
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="mailto:contact@irishwhistletunes.com"
              color="inherit"
              size="small"
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <EmailIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            py: 2,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} IrishWhistleTunes. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
