import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
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
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 3,
          color: theme.palette.primary.main,
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        Random Tunes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress
            size={28}
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {tunes.map((tune) => (
            <Card
              key={tune.tune_id}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(20, 20, 25, 0.9) 100%)`,
                borderRadius: "5px",
                transition: "all 0.3s ease-in-out",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 24px -4px rgba(0, 0, 0, 0.3)`,
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/thesession/tune/${tune.tune_id}`}
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    display: "block",
                    mb: 1,
                    "&:hover": {
                      color: theme.palette.primary.light,
                    },
                  }}
                >
                  {tune.name}
                </Typography>

                <Chip
                  label={tune.type}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    color: theme.palette.text.secondary,
                    borderRadius: "6px",
                    height: "22px",
                    "& .MuiChip-label": {
                      px: 1.5,
                      fontSize: "0.75rem",
                    },
                  }}
                />

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayCircleOutlineIcon />}
                  component={Link}
                  to={`/thesession/tune/${tune.tune_id}`}
                  sx={{
                    mt: 2,
                    width: "100%",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: theme.palette.primary.light,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                    },
                  }}
                >
                  Learn This Tune
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default RandomTunes;
