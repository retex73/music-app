import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../contexts/AuthContext";

const AccountMenu = () => {
  const { currentUser, login, logout, signup, resetPassword, deleteAccount } =
    useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    setError("");
    setMessage("");
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      switch (dialogType) {
        case "login":
          await login(email, password);
          handleDialogClose();
          break;
        case "signup":
          await signup(email, password);
          handleDialogClose();
          break;
        case "reset":
          await resetPassword(email);
          setMessage("Check your email for password reset instructions");
          break;
        case "delete":
          await deleteAccount();
          handleDialogClose();
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const menuItems = currentUser
    ? [
        <MenuItem key="email" disabled>
          {currentUser.email}
        </MenuItem>,
        <MenuItem key="reset" onClick={() => handleDialogOpen("reset")}>
          Reset Password
        </MenuItem>,
        <MenuItem key="delete" onClick={() => handleDialogOpen("delete")}>
          Delete Account
        </MenuItem>,
        <MenuItem key="logout" onClick={logout}>
          Logout
        </MenuItem>,
      ]
    : [
        <MenuItem key="login" onClick={() => handleDialogOpen("login")}>
          Login
        </MenuItem>,
        <MenuItem key="signup" onClick={() => handleDialogOpen("signup")}>
          Sign Up
        </MenuItem>,
      ];

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: "text.primary",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {menuItems}
      </Menu>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === "login" && "Login"}
          {dialogType === "signup" && "Sign Up"}
          {dialogType === "reset" && "Reset Password"}
          {dialogType === "delete" && "Delete Account"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {dialogType !== "delete" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {dialogType !== "reset" && (
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                )}
              </Box>
            )}

            {dialogType === "delete" && (
              <Alert severity="warning">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {dialogType === "login" && "Login"}
              {dialogType === "signup" && "Sign Up"}
              {dialogType === "reset" && "Send Reset Link"}
              {dialogType === "delete" && "Delete Account"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AccountMenu;
