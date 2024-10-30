import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Slider } from "@mui/material";
import abcjs from "abcjs";
// Import Font Awesome for the audio control icons
import "abcjs/abcjs-audio.css";
// Import our custom styles
import "./TuneAudioPlayer.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faStepBackward,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Initialize FontAwesome library
library.add(faPlay, faPause, faStepBackward, faPlayCircle);

const TuneAudioPlayer = ({ visualObj, settingId }) => {
  const synthControlRef = useRef(null);
  const midiBufferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempo, setTempo] = useState(100);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.destroy();
        synthControlRef.current = null;
      }
    };
  }, []);

  const handleTempoChange = (event, newValue) => {
    setTempo(newValue);
    if (synthControlRef.current) {
      synthControlRef.current.setWarp(newValue / 100);
    }
  };

  const activateAudio = async () => {
    if (!visualObj || !abcjs.synth.supportsAudio()) {
      console.error("Audio not supported or no visual object available");
      return;
    }

    setIsLoading(true);

    try {
      synthControlRef.current = new abcjs.synth.SynthController();
      synthControlRef.current.load(`#audio-${settingId}`, null, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: false,
        displayClock: false,
        displayTempo: false,
      });

      midiBufferRef.current = new abcjs.synth.CreateSynth();
      await midiBufferRef.current.init({
        visualObj: visualObj,
        millisecondsPerMeasure: 800,
        options: {
          soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/abcjs/",
          program: 0,
        },
      });

      await synthControlRef.current.setTune(visualObj, true);
      document
        .querySelector(`#audio-${settingId} .abcjs-inline-audio`)
        .classList.remove("disabled");
      setIsReady(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {!isReady && (
        <Button
          variant="contained"
          onClick={activateAudio}
          sx={{ mb: 1 }}
          disabled={!visualObj || isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Loading Audio...
            </>
          ) : (
            "Activate Audio"
          )}
        </Button>
      )}
      <div id={`audio-${settingId}`} className="abcjs-audio-container" />
      {isReady && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            px: 2,
          }}
        >
          <Box
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              minWidth: 60,
            }}
          >
            TEMPO
          </Box>
          <Slider
            value={tempo}
            onChange={handleTempoChange}
            min={50}
            max={200}
            sx={{
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.3,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TuneAudioPlayer;
