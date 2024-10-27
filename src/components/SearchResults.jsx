import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Pagination,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const ITEMS_PER_PAGE = 5;

const SearchResults = ({ results, hasSearched }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const handleTuneClick = (tuneId) => {
    // console log the tune id
    console.log("Tune ID:", tuneId);
    navigate(`/tune/${tuneId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Smooth scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Only show no results message if a search has been performed
  if (!results.length && hasSearched) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
          mt: 4,
        }}
      >
        <Typography variant="h6">
          No tunes found matching your search
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Try adjusting your search terms or check the spelling
        </Typography>
      </Box>
    );
  }

  // Return null if no search has been performed yet
  if (!hasSearched) {
    return null;
  }

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedResults = results.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ p: 3, maxWidth: "900px", mx: "auto" }}>
      <Grid container spacing={2}>
        {paginatedResults.map((tune, index) => (
          <Grid item xs={12} key={startIndex + index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleTuneClick(tune["Tune No."])}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { sm: "center" },
                  justifyContent: { sm: "space-between" },
                  gap: 2,
                  py: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {tune["Tune Title"]}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Chip
                      label={tune.Genre}
                      size="small"
                      sx={{
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                    />
                    <Chip
                      label={tune.Rhythm}
                      size="small"
                      sx={{
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                    />
                    <Chip
                      label={`${tune.Key} ${tune.Mode}`}
                      size="small"
                      sx={{
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                    />
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayCircleOutlineIcon />}
                  component="a"
                  href={tune["Learning Video"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    minWidth: "160px",
                    height: "40px",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Watch Tutorial
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "text.primary",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.2)",
                },
              },
            }}
          />
        </Box>
      )}

      {/* Results count */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Showing {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, results.length)} of{" "}
          {results.length} results
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchResults;
