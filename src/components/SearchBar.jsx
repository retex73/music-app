import React, { useState, useEffect, useCallback } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash/debounce"; // Make sure to install lodash

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Create a memoized debounced function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setDebouncedQuery(searchTerm);
    }, 500),
    []
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Only trigger the actual search when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery !== query) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearch]);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Immediately trigger search on form submission
    debouncedSearch.cancel();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <IconButton type="submit" sx={{ p: "10px" }}>
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
          placeholder="Search for tunes"
          value={query}
          onChange={handleInputChange}
          type="text"
        />
      </Paper>
    </form>
  );
};

export default SearchBar;
