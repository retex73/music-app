import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Pagination,
  Button,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

const ITEMS_PER_PAGE = 10;
const ALPHABET = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TUNE_TYPES = [
  "jig",
  "reel",
  "slip jig",
  "hornpipe",
  "polka",
  "slide",
  "waltz",
  "barndance",
  "strathspey",
  "three-two",
  "mazurka",
  "march",
];

const CataloguePage = () => {
  const [tunes, setTunes] = useState([]);
  const [filteredTunes, setFilteredTunes] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTunes = async () => {
      try {
        const response = await fetch("/data/session_tunes_data.csv");
        const text = await response.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });
        setTunes(result.data);
        setFilteredTunes(result.data);
      } catch (error) {
        console.error("Error loading tunes:", error);
      }
    };
    loadTunes();
  }, []);

  useEffect(() => {
    let filtered = tunes;

    if (searchTerm) {
      filtered = filtered.filter(
        (tune) =>
          tune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tune.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLetter) {
      if (selectedLetter === "#") {
        filtered = filtered.filter((tune) => /^[^a-zA-Z]/.test(tune.name));
      } else {
        filtered = filtered.filter((tune) =>
          tune.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
        );
      }
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((tune) =>
        selectedTypes.includes(tune.type.toLowerCase())
      );
    }

    setFilteredTunes(filtered);
    setPage(1);
  }, [searchTerm, selectedLetter, selectedTypes, tunes]);

  const handleTuneClick = (tuneId) => {
    navigate(`/thesession/tune/${tuneId}`);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedTunes = filteredTunes.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredTunes.length / ITEMS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tune Catalogue
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search tunes..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Filter by Type
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {TUNE_TYPES.map((type) => (
              <Chip
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                onClick={() => handleTypeToggle(type)}
                color={selectedTypes.includes(type) ? "primary" : "default"}
                variant={selectedTypes.includes(type) ? "filled" : "outlined"}
                sx={{
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      selectedTypes.includes(type)
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                  },
                }}
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Filter by Letter
          </Typography>
          <Grid container spacing={1}>
            {ALPHABET.map((letter) => (
              <Grid item key={letter}>
                <Button
                  variant={selectedLetter === letter ? "contained" : "outlined"}
                  size="small"
                  onClick={() =>
                    setSelectedLetter(letter === selectedLetter ? "" : letter)
                  }
                >
                  {letter}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {filteredTunes.length} tunes found
          </Typography>
          {displayedTunes.map((tune) => (
            <Box
              key={`${tune.tune_id}-${tune.setting_id}`}
              sx={{
                p: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
              onClick={() => handleTuneClick(tune.tune_id)}
            >
              <Typography variant="h6">{tune.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {tune.type} | Mode: {tune.mode} | Meter: {tune.meter}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default CataloguePage;
