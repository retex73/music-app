import React, { useState, useEffect } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Make sure @mui/icons-material is installed

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Add debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trigger search with empty string when query is empty
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
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
      <IconButton sx={{ p: "10px" }}>
        <SearchIcon
          sx={{
            color: "white", // Explicit white color
            fontSize: 24, // Explicit size
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
        placeholder="Search for tunes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
      />
    </Paper>
  );
};

export default SearchBar;
