import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
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
  const [beatInfo, setBeatInfo] = useState({
    current: 0,
    total: 0,
    totalTime: 0,
  });

  const handleNoteClick = useCallback(
    (abcElem) => {
      if (!abcElem?.midiPitches) return;

      abcjs.synth
        .playEvent(
          abcElem.midiPitches,
          abcElem.midiGraceNotePitches,
          visualObj.millisecondsPerMeasure()
        )
        .catch((error) => console.error("Error playing note:", error));
    },
    [visualObj]
  );

  useEffect(() => {
    // Create click listener when visualObj changes
    if (visualObj) {
      const paperElement = document.querySelector(`#paper-${settingId} svg`);
      if (paperElement) {
        // Add click listener to the SVG
        paperElement.addEventListener("click", (event) => {
          const closestNote = event.target.closest(".abcjs-note");
          if (closestNote) {
            const dataIndex = closestNote.getAttribute("data-index");
            const abcElem = visualObj.getElementFromChar(dataIndex);
            handleNoteClick(abcElem);
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.destroy();
        synthControlRef.current = null;
      }
    };
  }, [visualObj, settingId, handleNoteClick]);

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
        displayWarp: true,
        displayClock: true,
        displayTempo: true,
        warpSlider: true,
        warpSliderMin: 50,
        warpSliderMax: 200,
        warpSliderStep: 1,
        warpSliderValue: 100,
      });

      midiBufferRef.current = new abcjs.synth.CreateSynth();
      await midiBufferRef.current.init({
        visualObj: visualObj,
        options: {
          soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/abcjs/",
          program: 0,
        },
      });

      await synthControlRef.current.setTune(visualObj, true, {
        cursor: cursorControl,
      });
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

  const cursorControl = {
    onStart: function () {
      // Create cursor line in SVG
      const svg = document.querySelector(`#paper-${settingId} svg`);
      const cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttributeNS(null, "x1", 0);
      cursor.setAttributeNS(null, "y1", 0);
      cursor.setAttributeNS(null, "x2", 0);
      cursor.setAttributeNS(null, "y2", 0);
      svg.appendChild(cursor);
    },

    onBeat: function (beatNumber, totalBeats, totalTime) {
      setBeatInfo({ current: beatNumber, total: totalBeats, totalTime });
    },

    onEvent: function (ev) {
      // Remove previous highlights
      const lastSelection = document.querySelectorAll(
        `#paper-${settingId} svg .highlight`
      );
      lastSelection.forEach((el) => el.classList.remove("highlight"));

      // Add highlight to current notes
      ev.elements.forEach((note) => {
        note.forEach((el) => el.classList.add("highlight"));
      });

      // Update cursor position
      const cursor = document.querySelector(
        `#paper-${settingId} svg .abcjs-cursor`
      );
      if (cursor) {
        cursor.setAttribute("x1", ev.left - 2);
        cursor.setAttribute("x2", ev.left - 2);
        cursor.setAttribute("y1", ev.top);
        cursor.setAttribute("y2", ev.top + ev.height);
      }
    },

    onFinished: function () {
      // Clean up highlights and cursor
      document
        .querySelectorAll(`#paper-${settingId} svg .highlight`)
        .forEach((el) => el.classList.remove("highlight"));
      const cursor = document.querySelector(
        `#paper-${settingId} svg .abcjs-cursor`
      );
      if (cursor) {
        cursor.setAttribute("x1", 0);
        cursor.setAttribute("x2", 0);
        cursor.setAttribute("y1", 0);
        cursor.setAttribute("y2", 0);
      }
    },
  };

  const downloadMidi = () => {
    const midi = abcjs.synth.getMidiFile(visualObj);
    // Create and trigger download
    const element = document.createElement("a");
    element.setAttribute("href", "data:audio/midi;base64," + btoa(midi));
    element.setAttribute("download", `tune-${settingId}.midi`);
    element.click();
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
        <>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Beat: {beatInfo.current}/{beatInfo.total} Time:{" "}
              {beatInfo.totalTime.toFixed(2)}s
            </Typography>
          </Box>

          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button onClick={downloadMidi} variant="outlined" size="small">
              Download MIDI
            </Button>
            <Button
              onClick={() =>
                synthControlRef.current?.download(`tune-${settingId}.wav`)
              }
              variant="outlined"
              size="small"
            >
              Download WAV
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TuneAudioPlayer;
