import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const TuneSummaryCard = ({ tune, isFavorite, onToggleFavorite }) => {
  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" component="h1" color="primary.main">
              {tune.name}
            </Typography>
            {tune.aliases && tune.aliases.length > 0 && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Also known as: {tune.aliases.join(", ")}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={onToggleFavorite}
            sx={{
              color: isFavorite ? "error.main" : "inherit",
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          {tune.type && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Type
              </Typography>
              <Chip label={tune.type} />
            </Box>
          )}

          {tune.settings && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Settings
              </Typography>
              <Typography>{tune.settings.length} versions</Typography>
            </Box>
          )}
        </Stack>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<PlayCircleOutlineIcon />}
          href={tune.url}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          sx={{
            py: 1.5,
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          View on TheSession
        </Button>
      </CardContent>
    </Card>
  );
};

export default TuneSummaryCard;
