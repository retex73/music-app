import React from "react";
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
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const SearchResults = ({ results }) => {
  const navigate = useNavigate();

  const handleTuneClick = (tuneId) => {
    navigate(`/tune/${tuneId}`);
  };

  if (!results.length) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {results.map((tune, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
              onClick={() => handleTuneClick(tune.trackId)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
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
                  sx={{ mb: 2, gap: 1 }}
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

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayCircleOutlineIcon />}
                  component="a"
                  href={tune["Learning Video"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  sx={{
                    mt: "auto",
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
    </Box>
  );
};

export default SearchResults;
