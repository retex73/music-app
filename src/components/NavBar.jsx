import React from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Custom styled logo text
const LogoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginRight: theme.spacing(4),
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

// Custom styled nav button
const NavButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
}));

const NavBar = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <LogoText component={RouterLink} to="/">
          IrishWhistleTunes
        </LogoText>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <NavButton component={RouterLink} to="/hatao">
            Hatao's Tune a Day
          </NavButton>
          <NavButton component={RouterLink} to="/thesession">
            The Session
          </NavButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
