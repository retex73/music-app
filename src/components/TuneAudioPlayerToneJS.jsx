import React, { useState, useRef, useCallback, useEffect } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";
import { abcToMidiArrayBuffer } from "../utils/midiNormalize";
import {
  Box,
  Button,
  IconButton,
  Slider,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { PlayArrow, Pause, Replay, Loop, GetApp } from "@mui/icons-material";

// Global player singleton - ensures only one player active at a time
let CURRENT_PLAYER_ID = null;

// Transport State Machine (constant)
const transportStateMachine = {
  STOPPED: { play: "PLAYING" },
  PLAYING: { pause: "PAUSED", stop: "STOPPED" },
  PAUSED: { play: "PLAYING", stop: "STOPPED" },
};

/**
 * Tone.js Audio Player Component
 *
 * Modern audio player using Tone.js for enhanced playback control:
 * - True pause/resume (maintains position)
 * - Seekable progress bar
 * - Accurate time tracking synced with audio clock
 * - Proper cleanup and disposal
 * - Multi-version tune support
 *
 * Props:
 * - visualObj: abcjs visual object containing rendered tune
 * - abcText: ABC notation text string (required for MIDI generation)
 * - settingId: unique identifier for this tune instance
 * - versionIndex: version index for multi-version tunes (default: 0)
 */
const TuneAudioPlayerToneJS = ({ visualObj, abcText, settingId, versionIndex = 0 }) => {
  // State Management
  const [transportState, setTransportState] = useState("STOPPED"); // STOPPED | PLAYING | PAUSED
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [hasAbcText, setHasAbcText] = useState(false);

  // Phase 2: Tempo and Loop controls
  const [tempo, setTempo] = useState(100); // 100 = 100% speed (normal)
  const [isLooping, setIsLooping] = useState(false);

  // Refs for Tone.js objects and data
  const synthRef = useRef(null);
  const partRef = useRef(null);
  const midiDataRef = useRef(null);
  const progressIdRef = useRef(null);
  const isDownloadingRef = useRef(false); // Guard against double-click downloads

  const transitionState = useCallback(
    (action) => {
      const nextState = transportStateMachine[transportState]?.[action];

      if (nextState) {
        setTransportState(nextState);

        switch (action) {
          case "play":
            // Stop other players before starting this one
            if (CURRENT_PLAYER_ID && CURRENT_PLAYER_ID !== settingId) {
              Tone.Transport.stop();
              Tone.Transport.seconds = 0;
            }
            CURRENT_PLAYER_ID = settingId;
            Tone.Transport.start();
            break;
          case "pause":
            Tone.Transport.pause();
            break;
          case "stop":
            Tone.Transport.stop();
            Tone.Transport.seconds = 0;
            setCurrentTime(0);
            if (CURRENT_PLAYER_ID === settingId) {
              CURRENT_PLAYER_ID = null;
            }
            break;
          default:
            break;
        }
      }
    },
    [transportState, settingId]
  );

  // Check if ABC text is available
  useEffect(() => {
    if (abcText && visualObj) {
      setHasAbcText(true);
      setError(null);
    } else {
      setError("ABC notation or visual object not available");
      setHasAbcText(false);
    }
  }, [abcText, visualObj]);

  // Calculate actual duration from note data
  const calculateActualDuration = useCallback((notes) => {
    if (!notes || notes.length === 0) return 0.5; // Minimum duration with buffer

    const lastNoteEnd = notes.reduce((max, note) => {
      const noteEnd = note.time + note.duration;
      return noteEnd > max ? noteEnd : max;
    }, 0);

    // Add buffer for reverb tail
    return lastNoteEnd + 0.5;
  }, []);

  // Initialize audio (called after Tone.start() in onActivate)
  const initializeAudio = useCallback(async () => {
    if (!visualObj || !abcText) {
      throw new Error("Visual object or ABC text not available");
    }

    // Step 1: iOS-specific audio unlock pattern
    if (Tone.context.state !== "running") {
      const buffer = Tone.context.createBuffer(1, 1, 22050);
      const source = Tone.context.createBufferSource();
      source.buffer = buffer;
      source.connect(Tone.context.destination);
      source.start(0);
    }

    // Step 2: Generate MIDI from ABC text (version-proof normalizer)
    const arrayBuffer = await abcToMidiArrayBuffer(abcText, versionIndex);

    // Step 3: Parse MIDI with @tonejs/midi
    const parsedMidi = new Midi(arrayBuffer);

    // Store parsed MIDI data
    midiDataRef.current = parsedMidi;

    // Step 4: Extract and prepare notes
    const notes = [];
    parsedMidi.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        notes.push({
          time: note.time,
          note: note.name,
          duration: note.duration,
          velocity: note.velocity,
        });
      });
    });

    // Sort notes by time for efficient processing
    notes.sort((a, b) => a.time - b.time);
    midiDataRef.current.notes = notes;

    // Step 5: Configure Transport
    Tone.Transport.bpm.value = parsedMidi.header.bpm || 120;
    Tone.Transport.loop = false;

    // Step 6: Create Synth
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
      volume: -8,
    }).toDestination();

    // Step 7: Create Part from notes
    partRef.current = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(
        note.note,
        note.duration,
        time,
        note.velocity
      );
    }, notes);

    partRef.current.start(0);

    // Step 8: Calculate and set duration (from note data, not MIDI duration!)
    const actualDuration = calculateActualDuration(notes);
    setDuration(actualDuration);

    // Step 9: Set up progress tracking using scheduleRepeat (NOT requestAnimationFrame!)
    progressIdRef.current = Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        setCurrentTime(Tone.Transport.seconds);
      }, time);
    }, 0.05); // Update every 50ms

    setIsReady(true);
  }, [visualObj, abcText, versionIndex, calculateActualDuration]);

  // Button click handler - ensures Tone.start() is called inside user gesture
  const onActivate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // CRITICAL: Must call Tone.start() inside user gesture (button click)
      await Tone.start();

      // Now initialize audio
      await initializeAudio();
    } catch (err) {
      console.error("Failed to activate audio:", err);
      setError(`Failed to activate audio: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [initializeAudio]);

  // Playback control functions
  const togglePlayPause = useCallback(() => {
    if (transportState === "PLAYING") {
      transitionState("pause");
    } else if (transportState === "PAUSED" || transportState === "STOPPED") {
      transitionState("play");
    }
  }, [transportState, transitionState]);

  // Seek handler (CRITICAL: NO Transport.cancel() call!)
  const handleSeek = useCallback(
    (event, newValue) => {
      const wasPlaying = transportState === "PLAYING";

      if (wasPlaying) {
        // Pause the transport
        Tone.Transport.pause();
        setTransportState("PAUSED");
      }

      // Set new position without calling cancel()
      Tone.Transport.seconds = newValue;
      setCurrentTime(newValue);

      if (wasPlaying) {
        // Resume playback
        Tone.Transport.start();
        setTransportState("PLAYING");
      }
    },
    [transportState]
  );

  // Restart playback
  const handleRestart = useCallback(() => {
    transitionState("stop");
  }, [transitionState]);

  // Phase 2: Tempo control handler
  const handleTempoChange = useCallback((event, newValue) => {
    setTempo(newValue);
    // Update Transport BPM (percentage of base BPM)
    if (midiDataRef.current) {
      const baseBPM = midiDataRef.current.header.bpm || 120;
      Tone.Transport.bpm.value = baseBPM * (newValue / 100);
    }
  }, []);

  // Phase 2: Loop toggle handler
  const handleLoopToggle = useCallback(() => {
    setIsLooping((prev) => {
      const newLoopState = !prev;
      Tone.Transport.loop = newLoopState;
      if (newLoopState) {
        // Set loop points to full duration
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = duration;
      }
      return newLoopState;
    });
  }, [duration]);

  // Phase 2: Download MIDI
  const handleDownloadMIDI = useCallback(async () => {
    if (!abcText) {
      setError("No ABC notation available for MIDI export");
      return;
    }

    // Guard against double-click downloads
    if (isDownloadingRef.current) return;
    isDownloadingRef.current = true;

    try {
      // Generate MIDI ArrayBuffer (version-proof normalizer with versionIndex)
      const arrayBuffer = await abcToMidiArrayBuffer(abcText, versionIndex);

      // Create Blob and download
      const blob = new Blob([arrayBuffer], { type: "audio/midi" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tune-${settingId}-v${versionIndex + 1}.mid`;
      document.body.appendChild(link);
      link.click();

      // Cleanup after download (Safari/Firefox robustness)
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        isDownloadingRef.current = false;
      }, 0);
    } catch (err) {
      console.error("Failed to download MIDI:", err);
      setError("Failed to download MIDI file");
      isDownloadingRef.current = false;
    }
  }, [abcText, settingId, versionIndex]);

  // Phase 2: Download WAV (using Tone.Offline)
  const handleDownloadWAV = useCallback(async () => {
    if (!midiDataRef.current) {
      setError("No MIDI data available for WAV export");
      return;
    }

    // Guard against double-click downloads
    if (isDownloadingRef.current) return;
    isDownloadingRef.current = true;

    try {
      setIsLoading(true);

      // Calculate duration from all tracks
      const allTracks = midiDataRef.current.tracks ?? [];
      let wavDuration = midiDataRef.current.duration;

      // Fallback: calculate from note data if duration not available
      if (!wavDuration || wavDuration === 0) {
        const lastNoteEnd = allTracks.flatMap(tr => tr.notes || [])
          .reduce((max, n) => Math.max(max, n.time + n.duration), 0);
        wavDuration = lastNoteEnd + 0.5; // Add reverb tail buffer
      }

      // Render audio offline
      const buffer = await Tone.Offline(async ({ transport }) => {
        // Create synth for offline rendering
        const offlineSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "triangle" },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        }).toDestination();

        // Schedule all tracks
        for (const track of allTracks) {
          const events = (track.notes || []).map(n => ({
            time: n.time,
            note: n.name,
            duration: n.duration,
            velocity: n.velocity
          }));

          new Tone.Part((time, event) => {
            offlineSynth.triggerAttackRelease(
              event.note,
              event.duration,
              time,
              event.velocity
            );
          }, events).start(0);
        }

        transport.start();
      }, wavDuration);

      // Convert AudioBuffer to WAV
      const { audioBufferToWav } = await import("../utils/audioUtils");
      const wavBlob = audioBufferToWav(buffer);

      // Download via Blob URL
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tune-${settingId}-v${versionIndex + 1}.wav`;
      document.body.appendChild(link);
      link.click();

      // Cleanup after download (Safari/Firefox robustness)
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        isDownloadingRef.current = false;
      }, 0);
    } catch (err) {
      console.error("Failed to download WAV:", err);
      setError("Failed to download WAV file");
      isDownloadingRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [settingId, versionIndex]);

  // Format time for display (MM:SS.ms)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  // Complete cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop and clear transport
      Tone.Transport.stop();
      Tone.Transport.cancel();

      // Clear scheduled progress updates
      if (progressIdRef.current) {
        Tone.Transport.clear(progressIdRef.current);
        progressIdRef.current = null;
      }

      // Dispose Tone.js objects
      if (partRef.current) {
        partRef.current.dispose();
        partRef.current = null;
      }

      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  // Monitor Transport state changes
  useEffect(() => {
    if (!isReady) return;

    const checkTransportState = () => {
      const toneState = Tone.Transport.state;

      // Sync our state machine with Tone's actual state
      if (toneState === "started" && transportState !== "PLAYING") {
        setTransportState("PLAYING");
      } else if (toneState === "paused" && transportState !== "PAUSED") {
        setTransportState("PAUSED");
      } else if (toneState === "stopped" && transportState !== "STOPPED") {
        setTransportState("STOPPED");
        setCurrentTime(0);
      }
    };

    const interval = setInterval(checkTransportState, 100);
    return () => clearInterval(interval);
  }, [transportState, isReady]);

  // Render activation button when not ready
  if (!isReady) {
    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={onActivate}
          sx={{
            mb: 1,
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8855 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #FF8855 0%, #FFA065 100%)",
            },
          }}
          disabled={!hasAbcText || !visualObj || isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Loading Audio...
            </>
          ) : (
            "Activate Audio"
          )}
        </Button>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", mt: 1 }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  // Render player UI when ready
  return (
    <Box sx={{ mt: 2 }}>
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
            mb: 0,
            flexWrap: "wrap",
          }}
        >
          {/* Transport Control Group */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Play/Pause Button - 48x48px Orange Gradient */}
            <IconButton
              onClick={togglePlayPause}
              disabled={!isReady}
              aria-label={transportState === "PLAYING" ? "pause" : "play"}
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
              {transportState === "PLAYING" ? (
                <Pause sx={{ width: 28, height: 28, display: "block" }} />
              ) : (
                <PlayArrow sx={{ width: 28, height: 28, display: "block" }} />
              )}
            </IconButton>

            {/* Restart Button */}
            <IconButton
              onClick={handleRestart}
              disabled={!isReady}
              aria-label="restart"
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
          </Box>

          {/* Progress Bar */}
          <Box sx={{ flex: 1, minWidth: 150, display: "flex", gap: 1.5 }}>
            <Slider
              disabled={!isReady}
              value={currentTime}
              onChange={handleSeek}
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

          {/* Phase 2: Loop Toggle Button */}
          <IconButton
            onClick={handleLoopToggle}
            disabled={!isReady}
            aria-label="toggle loop"
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
                ? "linear-gradient(135deg, #FF6B35 0%, #FF8855 100%)"
                : "rgba(255, 255, 255, 0.05)",
              border: isLooping ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
              color: isLooping ? "white" : "rgba(255, 255, 255, 0.9)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: isLooping
                  ? "linear-gradient(135deg, #FF8855 0%, #FFA065 100%)"
                  : "rgba(255, 255, 255, 0.1)",
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
            <Loop sx={{ width: 18, height: 18, display: "block" }} />
          </IconButton>
        </Box>

        {/* Phase 2: Row 2 - Tempo Control */}
        <Box
          sx={{
            mt: 3,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "12px",
              minWidth: 60,
            }}
          >
            Tempo: {tempo}%
          </Typography>
          <Slider
            disabled={!isReady}
            value={tempo}
            onChange={handleTempoChange}
            min={50}
            max={200}
            step={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            sx={{
              flex: 1,
              height: 6,
              "& .MuiSlider-rail": {
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: 3,
              },
              "& .MuiSlider-track": {
                background: "linear-gradient(90deg, #FF6B35 0%, #FF8855 100%)",
                borderRadius: 3,
              },
              "& .MuiSlider-thumb": {
                width: 14,
                height: 14,
                background: "#FFFFFF",
                border: "2px solid #FF6B35",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  width: 16,
                  height: 16,
                  boxShadow: "0 2px 12px rgba(255, 107, 53, 0.4)",
                },
              },
              "& .MuiSlider-valueLabel": {
                fontSize: "11px",
                background: "#FF6B35",
                borderRadius: "4px",
              },
            }}
          />
        </Box>

        {/* Phase 2: Row 3 - Download Buttons */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleDownloadMIDI}
            disabled={!isReady || isLoading}
            variant="outlined"
            size="small"
            startIcon={<GetApp />}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              textTransform: "none",
              fontSize: "12px",
              "&:hover": {
                borderColor: "#FF6B35",
                background: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            MIDI
          </Button>
          <Button
            onClick={handleDownloadWAV}
            disabled={!isReady || isLoading}
            variant="outlined"
            size="small"
            startIcon={<GetApp />}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              textTransform: "none",
              fontSize: "12px",
              "&:hover": {
                borderColor: "#FF6B35",
                background: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            {isLoading ? "Generating..." : "WAV"}
          </Button>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", mt: 1 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TuneAudioPlayerToneJS;
