import React, { useState, useEffect } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Add debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <Paper
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        borderRadius: "100px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <SearchIcon sx={{ p: "10px", color: "text.secondary" }} />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Searching is easier"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
      />
    </Paper>
  );
};

export default SearchBar;
