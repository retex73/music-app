import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF6B35", // The orange accent color
      light: "#FF8B55",
      dark: "#CC4415",
    },
    secondary: {
      main: "#2A9D8F", // The teal/green color from the category buttons
      light: "#4ABDB0",
      dark: "#1A7D70",
    },
    background: {
      default: "#0A0A0F", // Very dark blue-black background
      paper: "#141419", // Slightly lighter dark for cards/components
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    action: {
      active: "#FFFFFF",
      hover: "rgba(255, 255, 255, 0.08)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#141419",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#141419",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.MuiPaper-root": {
            backgroundColor: "rgba(255, 255, 255, 0.04)", // Subtle transparent background
            backdropFilter: "blur(12px)", // Adds a modern frosted glass effect
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#fff",
          "&::placeholder": {
            color: "rgba(255, 255, 255, 0.5)",
            opacity: 1,
          },
          fontSize: "1rem",
          padding: "4px 0",
        },
        input: {
          "&::placeholder": {
            color: "rgba(255, 255, 255, 0.5)",
            opacity: 1,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default darkTheme;
