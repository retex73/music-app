import React, { useState, useCallback, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import TheSessionSearchBar from "../components/TheSessionSearchBar";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Pagination,
  IconButton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { searchSessionTunes } from "../services/sessionService";
import SessionFavoritesList from "../components/SessionFavoritesList";
import { useFavorites } from "../contexts/FavoritesContext";

const ITEMS_PER_PAGE = 10;

const TheSessionPage = () => {
  const [tunes, setTunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedQuery = sessionStorage.getItem("lastSessionSearch");
    return savedQuery || "";
  });

  const navigate = useNavigate();
  const { sessionFavorites, toggleFavorite } = useFavorites();

  const debouncedFetch = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      setTunes([]);
      sessionStorage.removeItem("lastSessionSearch");
      sessionStorage.removeItem("lastSessionResults");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const tunes = await searchSessionTunes(searchTerm);
      setTunes(tunes);
      sessionStorage.setItem("lastSessionSearch", searchTerm);
      sessionStorage.setItem("lastSessionResults", JSON.stringify(tunes));
    } catch (err) {
      setError(err.message);
      setTunes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(debouncedFetch, 500),
    [debouncedFetch]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      setPage(1);
      debouncedSearch(searchTerm);
    },
    [debouncedSearch]
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFavorite = useCallback(
    (tuneId) => {
      toggleFavorite(tuneId, "session");
    },
    [toggleFavorite]
  );

  // Calculate pagination values
  const totalPages = Math.ceil(tunes.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTunes = tunes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Add effect to restore previous search results
  useEffect(() => {
    const savedQuery = sessionStorage.getItem("lastSessionSearch");
    const savedResults = sessionStorage.getItem("lastSessionResults");

    if (savedQuery && savedResults) {
      setSearchQuery(savedQuery);
      setTunes(JSON.parse(savedResults));
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          py: 4,
        }}
      >
        <Box sx={{ flex: 1, mr: 4 }}>
          <SessionFavoritesList />
        </Box>
        <Box sx={{ flex: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
            The Session Tunes
          </Typography>

          <TheSessionSearchBar
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {error}
            </Typography>
          )}

          {!loading && !error && tunes.length === 0 && (
            <Typography sx={{ mt: 2 }}>
              Enter a search term to find tunes
            </Typography>
          )}

          {!loading && !error && tunes.length > 0 && (
            <Box sx={{ p: 3, maxWidth: "900px", mx: "auto" }}>
              <Grid container spacing={2}>
                {paginatedTunes.map((tune) => (
                  <Grid item xs={12} key={tune.tune_id}>
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
                      onClick={() =>
                        navigate(`/thesession/tune/${tune.tune_id}`, {
                          state: { fromSearch: true },
                        })
                      }
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
                            {tune.name}
                            {tune.alias && (
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ ml: 1, color: "text.secondary" }}
                              >
                                ({tune.alias})
                              </Typography>
                            )}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ gap: 1 }}
                          >
                            <Chip
                              label={tune.type}
                              size="small"
                              sx={{
                                bgcolor: "background.paper",
                                "&:hover": { bgcolor: "background.paper" },
                              }}
                            />
                          </Stack>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(String(tune.tune_id));
                            }}
                            sx={{
                              color: sessionFavorites.includes(
                                String(tune.tune_id)
                              )
                                ? "error.main"
                                : "inherit",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            {sessionFavorites.includes(String(tune.tune_id)) ? (
                              <FavoriteIcon />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>

                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PlayCircleOutlineIcon />}
                            component="a"
                            href={tune.url}
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
                            View on TheSession
                          </Button>
                        </Box>
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
                  {Math.min(startIndex + ITEMS_PER_PAGE, tunes.length)} of{" "}
                  {tunes.length} results
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default TheSessionPage;
