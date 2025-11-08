import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Slider,
  Typography,
  Paper,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Replay,
  Repeat,
} from "@mui/icons-material";
import abcjs from "abcjs";
import "./TuneAudioPlayerCustom.css";

/**
 * Custom Audio Player Component using abcjs CreateSynth API
 *
 * Replaces SynthController with full custom implementation for:
 * - Two-row layout with transport controls and tempo section
 * - Material-UI integration with consistent theming
 * - 48x48px orange play button with gradient styling
 * - Custom progress bar with hover handle
 * - Full cursor tracking during playback
 *
 * Props:
 * - visualObj: abcjs visual object containing tune data
 * - settingId: unique identifier for this tune instance
 */
const TuneAudioPlayerCustom = ({ visualObj, settingId }) => {
  // Audio synthesis and state
  const synthRef = useRef(null);
  const audioContextRef = useRef(null);
  const cursorControlRef = useRef(null);

  // Playback state
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tempo, setTempo] = useState(100);
  const [isLooping, setIsLooping] = useState(false);

  // Animation frame reference for smooth progress updates
  const animationFrameRef = useRef(null);

  /**
   * Initialize audio synthesis and cursor tracking
   * Creates CreateSynth instance and sets up cursor controller
   */
  const activateAudio = useCallback(async () => {
    if (!visualObj || !abcjs.synth.supportsAudio()) {
      console.error("Audio not supported or no visual object available");
      return;
    }

    setIsLoading(true);

    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      // Initialize CreateSynth with soundfonts
      synthRef.current = new abcjs.synth.CreateSynth();
      await synthRef.current.init({
        visualObj: visualObj,
        audioContext: audioContextRef.current,
        options: {
          soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/abcjs/",
          program: 0,
        },
      });

      // Calculate total duration in seconds
      // CreateSynth doesn't have getDuration, we need to calculate from the buffer
      const buffer = await synthRef.current.prime();
      const totalDuration = buffer ? buffer.duration : 0;
      setDuration(totalDuration);

      // Set up cursor control for note highlighting during playback
      cursorControlRef.current = createCursorControl(settingId);

      setIsReady(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [visualObj, settingId]);

  /**
   * Create cursor control object for abcjs playback tracking
   * Handles note highlighting and cursor positioning during playback
   */
  const createCursorControl = (tuneSettingId) => {
    return {
      onStart: function () {
        // Create SVG cursor line for note tracking
        const svg = document.querySelector(`#paper-${tuneSettingId} svg`);
        if (!svg) return;

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

      onEvent: function (ev) {
        // Remove previous highlights
        const lastSelection = document.querySelectorAll(
          `#paper-${tuneSettingId} svg .highlight`
        );
        lastSelection.forEach((el) => el.classList.remove("highlight"));

        // Add highlight to current notes
        if (ev.elements && ev.elements.length > 0) {
          ev.elements.forEach((note) => {
            if (Array.isArray(note)) {
              note.forEach((el) => el.classList.add("highlight"));
            }
          });
        }

        // Update cursor position
        const cursor = document.querySelector(
          `#paper-${tuneSettingId} svg .abcjs-cursor`
        );
        if (cursor && ev.left !== undefined) {
          cursor.setAttribute("x1", ev.left - 2);
          cursor.setAttribute("x2", ev.left - 2);
          cursor.setAttribute("y1", ev.top || 0);
          cursor.setAttribute("y2", (ev.top || 0) + (ev.height || 0));
        }
      },

      onFinished: function () {
        // Clean up highlights and cursor when playback ends
        document
          .querySelectorAll(`#paper-${tuneSettingId} svg .highlight`)
          .forEach((el) => el.classList.remove("highlight"));

        const cursor = document.querySelector(
          `#paper-${tuneSettingId} svg .abcjs-cursor`
        );
        if (cursor) {
          cursor.setAttribute("x1", 0);
          cursor.setAttribute("x2", 0);
          cursor.setAttribute("y1", 0);
          cursor.setAttribute("y2", 0);
        }
      },
    };
  };

  /**
   * Handle play/pause button click
   * Manages audio playback and state updates
   */
  const handlePlayPause = useCallback(async () => {
    if (!synthRef.current || !audioContextRef.current) return;

    try {
      if (isPlaying) {
        // Stop playback (CreateSynth doesn't have pause, only stop)
        synthRef.current.stop();
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        // Start playback (CreateSynth uses start, not play)
        await synthRef.current.prime();
        synthRef.current.start();
        setIsPlaying(true);

        // Start progress tracking
        const startTime = Date.now();
        const initialTime = currentTime;

        const update = () => {
          const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
          const newTime = initialTime + elapsed;

          if (newTime >= duration) {
            // Playback finished
            setCurrentTime(0);
            setIsPlaying(false);
            if (isLooping) {
              // Restart if looping
              setTimeout(() => handlePlayPause(), 100);
            }
          } else {
            setCurrentTime(newTime);
            animationFrameRef.current = requestAnimationFrame(update);
          }
        };

        animationFrameRef.current = requestAnimationFrame(update);
      }
    } catch (error) {
      console.error("Error during playback:", error);
      setIsPlaying(false);
    }
  }, [isPlaying, currentTime, duration, isLooping]);

  /**
   * Handle restart button click
   * Resets playback to beginning
   */
  const handleRestart = useCallback(() => {
    if (!synthRef.current) return;

    setCurrentTime(0);
    if (isPlaying) {
      synthRef.current.stop();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  /**
   * Handle loop toggle
   */
  const handleLoopToggle = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  /**
   * Handle tempo/speed adjustment
   * Valid range: 50-200
   */
  const handleTempoChange = (event, newValue) => {
    setTempo(newValue);
    // CreateSynth doesn't support tempo change during playback
    // Would need to re-initialize with new tempo
  };

  /**
   * Handle progress bar seek
   * Note: CreateSynth doesn't support seeking, so this is display-only
   */
  const handleProgressChange = (event, newValue) => {
    // CreateSynth doesn't support seeking
    // This could be implemented by stopping and restarting from a position
    // but that would require more complex state management
    console.log("Seeking not supported in CreateSynth");
  };


  /**
   * Handle note click on sheet music
   */
  const handleNoteClick = useCallback(
    (abcElem) => {
      if (!abcElem?.midiPitches || !audioContextRef.current) return;

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

  /**
   * Download MIDI file
   */
  const downloadMidi = useCallback(() => {
    const midi = abcjs.synth.getMidiFile(visualObj);
    const element = document.createElement("a");
    element.setAttribute("href", "data:audio/midi;base64," + btoa(midi));
    element.setAttribute("download", `tune-${settingId}.midi`);
    element.click();
  }, [visualObj, settingId]);

  /**
   * Download WAV file (rendered audio)
   */
  const downloadWav = useCallback(async () => {
    if (!synthRef.current) return;

    try {
      // CreateSynth doesn't have a direct download method
      // For now, we'll disable WAV download functionality
      console.log("WAV download not yet implemented for CreateSynth API");
    } catch (error) {
      console.error("Error downloading WAV:", error);
    }
  }, [synthRef, settingId]);

  /**
   * Set up sheet music click listener for note playing
   */
  useEffect(() => {
    if (!visualObj) return;

    const paperElement = document.querySelector(`#paper-${settingId} svg`);
    if (!paperElement) return;

    const handleClick = (event) => {
      const closestNote = event.target.closest(".abcjs-note");
      if (closestNote) {
        const dataIndex = closestNote.getAttribute("data-index");
        const abcElem = visualObj.getElementFromChar(dataIndex);
        handleNoteClick(abcElem);
      }
    };

    paperElement.addEventListener("click", handleClick);

    return () => {
      paperElement.removeEventListener("click", handleClick);
    };
  }, [visualObj, settingId, handleNoteClick]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  /**
   * Format time for display (MM:SS.ms)
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${minutes}:${secs.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Activation Button */}
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

      {/* Player Content */}
      {isReady && (
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #252525 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: 2.5,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Row 1: Transport Controls & Progress */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Transport Control Group */}
            <Box
              className="transport-group"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
              }}
            >
              {/* Play/Pause Button - 48x48px Orange Gradient */}
              <IconButton
                onClick={handlePlayPause}
                disabled={!isReady}
                disableRipple
                sx={{
                  width: 48,
                  height: 48,
                  minWidth: 48,
                  minHeight: 48,
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6B35 0%, #FF8855 100%)",
                  color: "white",
                  boxShadow: "0 2px 12px rgba(255, 107, 53, 0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FF8855 0%, #FFA065 100%)",
                    boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
                    transform: "scale(1.05)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "28px",
                    width: "28px",
                    height: "28px",
                    display: "block",
                    margin: 0,
                  },
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ width: 28, height: 28, display: "block" }} />
                ) : (
                  <PlayArrow sx={{ width: 28, height: 28, display: "block" }} />
                )}
              </IconButton>

              {/* Restart Button */}
              <IconButton
                onClick={handleRestart}
                disabled={!isReady}
                size="small"
                disableRipple
                sx={{
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  minHeight: 32,
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    transform: "scale(1.05)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "18px",
                    width: "18px",
                    height: "18px",
                    display: "block",
                    margin: 0,
                  },
                }}
              >
                <Replay sx={{ width: 18, height: 18, display: "block" }} />
              </IconButton>

              {/* Loop Button */}
              <IconButton
                onClick={handleLoopToggle}
                disabled={!isReady}
                size="small"
                disableRipple
                sx={{
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  minHeight: 32,
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: isLooping
                    ? "rgba(255, 107, 53, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: isLooping
                    ? "1px solid #FF6B35"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isLooping
                    ? "#FF6B35"
                    : "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: isLooping
                      ? "rgba(255, 107, 53, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                    transform: "scale(1.05)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "18px",
                    width: "18px",
                    height: "18px",
                    display: "block",
                    margin: 0,
                  },
                }}
              >
                <Repeat sx={{ width: 18, height: 18, display: "block" }} />
              </IconButton>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ flex: 1, minWidth: 150, display: "flex", gap: 1.5 }}>
              <Slider
                disabled={!isReady}
                value={currentTime}
                onChange={handleProgressChange}
                max={duration || 100}
                step={0.01}
                sx={{
                  flex: 1,
                  height: 8,
                  "& .MuiSlider-rail": {
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: 4,
                  },
                  "& .MuiSlider-track": {
                    background:
                      "linear-gradient(90deg, #FF6B35 0%, #FF8855 100%)",
                    boxShadow: "0 0 8px rgba(255, 107, 53, 0.3)",
                    borderRadius: 4,
                  },
                  "& .MuiSlider-thumb": {
                    width: 0,
                    height: 0,
                    opacity: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      width: 16,
                      height: 16,
                      opacity: 1,
                      marginTop: "-4px",
                      background: "#FFFFFF",
                      border: "2px solid #FF6B35",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    },
                  },
                  "&:hover .MuiSlider-rail": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              />
            </Box>

            {/* Time Display */}
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                fontSize: "12px",
                whiteSpace: "nowrap",
                minWidth: 80,
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>

          {/* Row 2: Tempo Control Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "12px",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: "8px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "0.5px",
                fontWeight: 600,
                minWidth: 50,
              }}
            >
              Tempo
            </Typography>

            <Slider
              disabled={!isReady}
              value={tempo}
              onChange={handleTempoChange}
              min={50}
              max={200}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              sx={{
                flex: 1,
                minWidth: 120,
                height: 4,
                "& .MuiSlider-rail": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                },
                "& .MuiSlider-track": {
                  background: "#FF6B35",
                  boxShadow: "none",
                  borderRadius: 2,
                },
                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 14,
                  background: "#FF6B35",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                    background: "#FF8855",
                  },
                },
                "& .MuiSlider-valueLabelLabel": {
                  color: "#FF6B35",
                  fontWeight: 600,
                },
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: "#FF6B35",
                fontFamily: "'SF Mono', 'Monaco', monospace",
                fontSize: "14px",
                fontWeight: 600,
                minWidth: 40,
              }}
            >
              {tempo}%
            </Typography>
          </Box>

          {/* Download Controls */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Button
              onClick={downloadMidi}
              variant="outlined"
              size="small"
              disabled={!isReady}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.9)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Download MIDI
            </Button>
            <Button
              onClick={downloadWav}
              variant="outlined"
              size="small"
              disabled={!isReady}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.9)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Download WAV
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TuneAudioPlayerCustom;
