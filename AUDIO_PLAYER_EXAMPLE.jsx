/**
 * EXAMPLE: Using TuneAudioPlayerCustom in a Page Component
 *
 * This file demonstrates the proper way to integrate the custom audio player
 * with your sheet music rendering. Use this as a template for updating pages.
 */

import React, { useState, useEffect } from "react";
import { Box, Paper, CircularProgress } from "@mui/material";
import TuneAudioPlayerCustom from "../components/TuneAudioPlayerCustom";
import abcjs from "abcjs";

/**
 * Example Page Component: TheSessionTuneDetailsPage
 *
 * Renders a tune from The Session with:
 * - ABC notation sheet music
 * - Custom audio player
 * - Proper cursor tracking during playback
 */
const TheSessionTuneDetailsPage = ({ tuneId }) => {
  const [tune, setTune] = useState(null);
  const [visualObj, setVisualObj] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  // Fetch tune data and render sheet music
  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        // 1. Fetch tune data (your actual data fetching logic)
        const tuneData = await fetchTuneData(tuneId);
        setTune(tuneData);

        // 2. Render ABC notation to get visualObj
        setIsRendering(true);
        const rendered = abcjs.renderAbc(
          `paper-${tuneId}`,
          tuneData.abc,
          {
            responsive: "resize",
            staffwidth: 800,
          }
        );

        if (rendered && rendered.length > 0) {
          setVisualObj(rendered[0]);
        }
      } catch (error) {
        console.error("Error rendering tune:", error);
      } finally {
        setIsRendering(false);
      }
    };

    if (tuneId) {
      fetchAndRender();
    }
  }, [tuneId]);

  if (!tune) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <h1>{tune.name}</h1>

      {/* Sheet Music Container */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: 3,
          marginBottom: 3,
          minHeight: 400,
        }}
      >
        {isRendering ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div id={`paper-${tuneId}`}>
            {/* abcjs renders sheet music here */}
          </div>
        )}
      </Paper>

      {/* Audio Player - Pass visualObj and tuneId */}
      {visualObj && (
        <Box sx={{ mb: 4 }}>
          <TuneAudioPlayerCustom visualObj={visualObj} settingId={tuneId} />
        </Box>
      )}

      {/* Additional tune information */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: 3,
        }}
      >
        <h3>Tune Details</h3>
        <p>Type: {tune.type}</p>
        <p>Mode: {tune.mode}</p>
        <p>Meter: {tune.meter}</p>
      </Paper>
    </Box>
  );
};

/**
 * Critical Implementation Notes:
 *
 * 1. SHEET MUSIC CONTAINER ID
 *    The container where abcjs renders MUST have ID: `paper-${settingId}`
 *    This is used for:
 *    - Finding SVG for cursor positioning
 *    - Detecting note clicks
 *    - Highlighting notes during playback
 *
 * 2. VISUAL OBJ DEPENDENCY
 *    TuneAudioPlayerCustom requires visualObj from abcjs.renderAbc()
 *    Only render the player after renderAbc completes successfully
 *
 * 3. UNIQUE IDENTIFIERS
 *    If rendering multiple tunes on one page, use unique settingId for each:
 *    - paper-${settingId} for sheet music
 *    - settingId prop for audio player
 *    Otherwise cursor tracking will affect wrong tune
 *
 * 4. EVENT LISTENER CLEANUP
 *    The component handles its own cleanup:
 *    - Removes click listeners on unmount
 *    - Cancels animation frames
 *    - Stops audio playback
 *    You don't need to do anything
 *
 * 5. ABC RENDER OPTIONS
 *    For best results with audio player:
 *    - Use responsive: "resize" for proper sizing
 *    - Ensure staffwidth matches your layout
 *    - The visualObj[0] is what gets passed to player
 *
 * 6. MOBILE CONSIDERATIONS
 *    - AudioContext requires user interaction to start
 *    - "Activate Audio" button provides this interaction
 *    - Progress updates use requestAnimationFrame (60fps safe)
 *    - Slider handles are hidden until hover (mobile-friendly)
 */

// Example of fetching tune data (adapt to your actual API)
async function fetchTuneData(tuneId) {
  // Replace with your actual data fetching logic
  const response = await fetch(`/api/tunes/${tuneId}`);
  return response.json();
}

export default TheSessionTuneDetailsPage;

/**
 * ============================================================================
 * ALTERNATIVE: Multiple Settings for Same Tune
 * ============================================================================
 *
 * If you have multiple versions/settings of the same tune:
 */

const TuneWithMultipleSettings = ({ tuneId }) => {
  const [tune, setTune] = useState(null);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const loadTune = async () => {
      const tuneData = await fetchTuneData(tuneId);
      setTune(tuneData);
      setSettings(tuneData.settings || []);
    };

    loadTune();
  }, [tuneId]);

  return (
    <Box>
      {settings.map((setting) => {
        // Create unique ID for each setting
        const settingId = `${tuneId}_${setting.id}`;

        return (
          <Box key={settingId} sx={{ mb: 4 }}>
            <h3>{setting.name}</h3>

            {/* Unique container for each setting */}
            <div id={`paper-${settingId}`}>
              {/* Sheet music renders here */}
            </div>

            {/* Audio player with unique settingId */}
            <TuneAudioPlayerCustom
              visualObj={setting.visualObj}
              settingId={settingId}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export { TuneWithMultipleSettings };

/**
 * ============================================================================
 * PERFORMANCE TIPS
 * ============================================================================
 *
 * 1. Only render audio player after abcjs.renderAbc() completes
 *    - Check visualObj is not null before rendering TuneAudioPlayerCustom
 *    - Show loading spinner while rendering
 *
 * 2. Use unique settingIds for multiple tunes on one page
 *    - Prevents cursor tracking conflicts
 *    - Allows independent playback of each tune
 *
 * 3. Memoize visualObj if parent re-renders frequently
 *    - Use useMemo to prevent re-initialization of audio player
 *    const visualObjMemo = useMemo(() => visualObj, [visualObj]);
 *
 * 4. Consider lazy loading for multiple tunes
 *    - Don't render all sheet music at once
 *    - Use tabs, accordion, or pagination
 *
 * 5. Audio context cleanup
 *    - Component stops synth on unmount
 *    - Multiple synths won't play simultaneously (correct behavior)
 *    - Browser handles AudioContext resource limits
 */
