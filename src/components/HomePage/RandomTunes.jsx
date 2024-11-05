import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Stack,
  useTheme,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { getRandomTunes } from "../../services/sessionService";

const RandomTunes = () => {
  const theme = useTheme();
  const [tunes, setTunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomTunes = async () => {
      try {
        const randomTunes = await getRandomTunes(3);
        setTunes(randomTunes);
      } catch (error) {
        console.error("Error fetching random tunes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomTunes();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.paper}99)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 2,
          color: theme.palette.primary.main,
        }}
      >
        Random Tunes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Stack spacing={2}>
          {tunes.map((tune) => (
            <Card
              key={tune.tune_id}
              sx={{
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/thesession/tune/${tune.tune_id}`}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {tune.name}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                  <Chip
                    label={tune.type}
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                  />
                </Stack>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayCircleOutlineIcon />}
                  component={Link}
                  to={`/thesession/tune/${tune.tune_id}`}
                  sx={{
                    width: "100%",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Learn This Tune
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default RandomTunes;
