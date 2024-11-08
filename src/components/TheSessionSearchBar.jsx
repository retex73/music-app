import React, { useState } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TheSessionSearchBar = ({ onSearch, initialQuery = "" }) => {
  const [query, setQuery] = useState(() => {
    const savedQuery = sessionStorage.getItem("lastSessionSearch");
    return savedQuery || initialQuery;
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Remove trim() here as it might interfere with typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
      <Paper
        elevation={0}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "100px",
          transition: "all 0.2s ease-in-out",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          "&:hover": {
            border: "1px solid rgba(255, 255, 255, 0.12)",
          },
          "&:focus-within": {
            border: "1px solid rgba(255, 255, 255, 0.16)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon
            sx={{
              color: "white",
              fontSize: 24,
            }}
          />
        </IconButton>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            "& input": {
              padding: "8px 0",
              fontSize: "0.95rem",
              fontWeight: 400,
            },
          }}
          placeholder="Search The Session tunes..."
          value={query}
          onChange={handleInputChange}
          type="text"
        />
      </Paper>
    </form>
  );
};

export default TheSessionSearchBar;
