import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTuneById } from "../services/tunesService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TuneDetailsPage() {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const [tune, setTune] = useState(null);

  useEffect(() => {
    const fetchTune = async () => {
      try {
        const tuneData = await getTuneById(tuneId);
        setTune(tuneData);
      } catch (error) {
        console.error("Error fetching tune details:", error);
      }
    };

    if (tuneId) {
      fetchTune();
    }
  }, [tuneId]);

  if (!tune) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        aria-label="back to search"
      >
        Back to Search
      </Button>

      <Card>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary.main"
          >
            {tune["Tune Title"]}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip label={`Set ${tune["Set No."]}`} />
            <Chip label={`Tune ${tune["Tune No."]}`} />
            <Chip label={tune["Genre"]} />
          </Stack>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Musical Details
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`Rhythm: ${tune["Rhythm"]}`} variant="outlined" />
                <Chip label={`Key: ${tune["Key"]}`} variant="outlined" />
                <Chip label={`Mode: ${tune["Mode"]}`} variant="outlined" />
                <Chip label={`Parts: ${tune["Part"]}`} variant="outlined" />
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Added
              </Typography>
              <Typography>{tune["Added"]}</Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayCircleOutlineIcon />}
            href={tune["Learning Video"]}
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
            Watch Tutorial Video
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TuneDetailsPage;
