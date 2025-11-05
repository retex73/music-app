# abcjs Styling Guide

Complete reference for styling abcjs audio player controls and visual elements.

## Table of Contents
1. [Default CSS Classes](#default-css-classes)
2. [Default Styling](#default-styling)
3. [Customization Strategies](#customization-strategies)
4. [Material-UI Integration](#material-ui-integration)
5. [Responsive Design](#responsive-design)
6. [Accessibility](#accessibility)

## Default CSS Classes

### Audio Player Container

**`.abcjs-inline-audio`**
- Main container for the audio player widget
- Default: Single-row flexbox layout
- Height: 26px (standard) or 52px (with `.abcjs-large`)
- Background: #424242 (dark gray)

```css
/* Default structure */
.abcjs-inline-audio {
  display: flex;
  align-items: center;
  background-color: #424242;
  color: #f4f4f4;
  padding: 0 5px;
  border-radius: 3px;
  height: 26px;
}
```

**`.abcjs-inline-audio.abcjs-disabled`**
- Disabled state for the player
- Default: Reduced opacity

```css
.abcjs-inline-audio.abcjs-disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

**`.abcjs-large`**
- Modifier for touch-friendly larger controls
- Height: 52px instead of 26px
- Larger touch targets for mobile devices

### Control Buttons

**`.abcjs-btn`**
- Base class for all button controls
- Size: 28px × 34px
- SVG-based icons

```css
.abcjs-btn {
  background: transparent;
  border: 1px solid transparent;
  width: 28px;
  height: 34px;
  cursor: pointer;
  padding: 0;
  margin: 0 2px;
}

.abcjs-btn:hover {
  border-color: #666666;
  background-color: rgba(255, 255, 255, 0.1);
}

.abcjs-btn:active,
.abcjs-btn.abcjs-pushed {
  background-color: rgba(255, 255, 255, 0.2);
}
```

**`.abcjs-midi-start`**
- Play/Pause button
- Contains `.abcjs-play-svg` and `.abcjs-pause-svg`

**`.abcjs-midi-reset`**
- Reset/Restart button
- Returns playback to beginning

**`.abcjs-midi-loop`**
- Loop toggle button
- Active state uses `.abcjs-pushed` class

**`.abcjs-midi-selection`**
- Selection button (if enabled)

**`.abcjs-pushed`**
- Active/pressed state for toggle buttons
- Used on loop button when active

### Button SVG Icons

**`.abcjs-play-svg`**
- Play icon (triangle)
- Hidden when playing

**`.abcjs-pause-svg`**
- Pause icon (two bars)
- Hidden when paused
- Style: `display: none` when inactive

**`.abcjs-loading-svg`**
- Loading spinner animation
- Shown during audio buffer loading

```css
.abcjs-btn svg {
  fill: #f4f4f4;
  stroke: #f4f4f4;
  width: 20px;
  height: 20px;
}
```

### Progress Bar

**`.abcjs-midi-progress-background`**
- Progress bar container
- Contains range input and visual indicator

```css
.abcjs-midi-progress-background {
  flex: 1;
  height: 10px;
  background: #424242;
  border: 2px solid #cccccc;
  border-radius: 5px;
  position: relative;
  margin: 0 10px;
  cursor: pointer;
}
```

**`.abcjs-midi-progress-indicator`**
- Progress thumb/playhead indicator
- Moves during playback

```css
.abcjs-midi-progress-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #f4f4f4;
  border-radius: 50%;
  pointer-events: none;
}
```

**Range Input** (hidden but functional)
```css
.abcjs-midi-progress-background input[type="range"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
```

### Time Display

**`.abcjs-midi-clock`**
- Time display (current/total time)
- Format: "0:00 / 2:30"

```css
.abcjs-midi-clock {
  font-family: sans-serif;
  font-size: 16px;
  color: #f4f4f4;
  white-space: nowrap;
  margin: 0 10px;
}
```

### Tempo Control

**`.abcjs-tempo-wrapper`**
- Container for tempo input

```css
.abcjs-tempo-wrapper {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
```

**`.abcjs-midi-tempo`**
- Tempo input field (number)
- Width: 42px
- Allows manual tempo adjustment

```css
.abcjs-midi-tempo {
  width: 42px;
  background: transparent;
  color: #f4f4f4;
  border: 1px solid #cccccc;
  border-radius: 3px;
  padding: 2px 5px;
  font-size: 14px;
  text-align: center;
}
```

### Warp Slider

**`.abcjs-warp-canvas`**
- Container for warp (tempo variation) slider
- Rendered separately from main audio control

```css
.abcjs-warp-canvas {
  margin-top: 10px;
  padding: 10px;
}
```

**`.abcjs-warp-slider`**
- Range input for tempo warp control
- Allows 50% - 150% tempo variation

```css
.abcjs-warp-slider {
  width: 100%;
  height: 20px;
}
```

## Default Styling

### Complete Default Theme

```css
/* From abcjs-audio.css */

.abcjs-inline-audio {
  display: flex;
  align-items: center;
  background-color: #424242;
  color: #f4f4f4;
  padding: 0 5px;
  border-radius: 3px;
  height: 26px;
  font-family: Arial, sans-serif;
}

.abcjs-large .abcjs-inline-audio {
  height: 52px;
}

.abcjs-btn {
  background: transparent;
  border: 1px solid transparent;
  width: 28px;
  height: 34px;
  cursor: pointer;
  padding: 0;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.abcjs-btn:hover {
  border-color: #666666;
  background-color: rgba(255, 255, 255, 0.1);
}

.abcjs-btn:active,
.abcjs-btn.abcjs-pushed {
  background-color: rgba(255, 255, 255, 0.2);
}

.abcjs-midi-progress-background {
  flex: 1;
  height: 10px;
  background: #424242;
  border: 2px solid #cccccc;
  border-radius: 5px;
  position: relative;
  margin: 0 10px;
  cursor: pointer;
  min-width: 100px;
}

.abcjs-midi-progress-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #f4f4f4;
  border-radius: 50%;
  pointer-events: none;
}

.abcjs-midi-clock {
  font-family: sans-serif;
  font-size: 16px;
  color: #f4f4f4;
  white-space: nowrap;
  margin: 0 10px;
}

.abcjs-midi-tempo {
  width: 42px;
  background: transparent;
  color: #f4f4f4;
  border: 1px solid #cccccc;
  border-radius: 3px;
  padding: 2px 5px;
  font-size: 14px;
  text-align: center;
}
```

## Customization Strategies

### Strategy 1: CSS Custom Properties (Recommended)

Use CSS variables for easy theme integration:

```css
:root {
  --abcjs-player-bg: #141419;
  --abcjs-player-text: #ffffff;
  --abcjs-player-accent: #FF6B35;
  --abcjs-player-border: rgba(255, 255, 255, 0.12);
  --abcjs-button-bg: rgba(255, 255, 255, 0.04);
  --abcjs-button-hover: rgba(255, 255, 255, 0.08);
}

.abcjs-inline-audio {
  background-color: var(--abcjs-player-bg) !important;
  color: var(--abcjs-player-text) !important;
}

.abcjs-btn {
  background: var(--abcjs-button-bg) !important;
  border-color: var(--abcjs-player-border) !important;
}

.abcjs-btn:hover {
  background: var(--abcjs-button-hover) !important;
}

.abcjs-midi-progress-indicator {
  background: var(--abcjs-player-accent) !important;
}
```

### Strategy 2: Specific Class Overrides

Target specific elements for precise control:

```css
/* Container styling */
#audio .abcjs-inline-audio {
  background: #141419 !important;
  padding: 12px !important;
  border-radius: 8px !important;
  gap: 8px !important;
}

/* Button styling - Material-UI aesthetic */
#audio .abcjs-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px !important; /* Pill-shaped */
  min-width: 32px !important;
  min-height: 32px !important;
  width: 32px !important;
  height: 32px !important;
  transition: all 0.2s ease !important;
}

#audio .abcjs-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.20) !important;
}

/* Icon sizing */
#audio .abcjs-btn svg {
  width: 18px !important;
  height: 18px !important;
  fill: #ffffff !important;
}

/* Progress bar */
#audio .abcjs-midi-progress-background {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  height: 8px !important;
  border-radius: 4px !important;
}

#audio .abcjs-midi-progress-indicator {
  background: #FF6B35 !important; /* Orange accent */
  width: 16px !important;
  height: 16px !important;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4) !important;
}
```

### Strategy 3: Grid Layout Override

Transform default flexbox to grid for custom layout:

```css
#audio .abcjs-inline-audio {
  display: grid !important;
  grid-template-areas:
    "controls progress"
    "tempo clock" !important;
  grid-template-columns: auto 1fr !important;
  grid-template-rows: auto auto !important;
  gap: 12px 16px !important;
  height: auto !important;
  padding: 16px !important;
}

#audio .abcjs-btn {
  grid-area: controls !important;
}

#audio .abcjs-midi-progress-background {
  grid-area: progress !important;
  margin: 0 !important;
}

#audio .abcjs-tempo-wrapper {
  grid-area: tempo !important;
}

#audio .abcjs-midi-clock {
  grid-area: clock !important;
  justify-self: end !important;
}
```

## Material-UI Integration

### Integration with MUI Dark Theme

```javascript
// darkTheme.js
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF6B35' },
    background: {
      default: '#0A0A0F',
      paper: '#141419'
    }
  }
});
```

```css
/* Match MUI theme colors */
#audio .abcjs-inline-audio {
  background: #141419 !important; /* theme.palette.background.paper */
  color: rgba(255, 255, 255, 0.87) !important; /* theme.palette.text.primary */
}

/* Match MUI button styling */
#audio .abcjs-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px !important; /* MUI Button default */
  min-height: 32px !important;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}

#audio .abcjs-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

/* Primary color accent */
#audio .abcjs-midi-progress-indicator {
  background: #FF6B35 !important; /* theme.palette.primary.main */
}

#audio .abcjs-btn.abcjs-pushed {
  background: rgba(255, 107, 53, 0.12) !important; /* primary with alpha */
  border-color: #FF6B35 !important;
}
```

### Using MUI Components Instead

For deeper integration, consider replacing abcjs controls with MUI components:

```javascript
import { IconButton, Slider, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// Don't use SynthController visual widget
// Use CreateSynth API directly + custom MUI controls

const CustomAudioPlayer = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <IconButton onClick={handlePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Slider
        value={progress}
        onChange={handleProgressChange}
        sx={{
          color: 'primary.main',
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
          }
        }}
      />
    </Box>
  );
};
```

## Responsive Design

### Mobile-First Approach

```css
/* Mobile (default) */
#audio .abcjs-inline-audio {
  flex-direction: column !important;
  gap: 12px !important;
  padding: 12px !important;
}

#audio .abcjs-btn {
  min-width: 44px !important; /* Touch target minimum */
  min-height: 44px !important;
}

/* Tablet and up */
@media (min-width: 768px) {
  #audio .abcjs-inline-audio {
    flex-direction: row !important;
    gap: 8px !important;
  }

  #audio .abcjs-btn {
    min-width: 36px !important;
    min-height: 36px !important;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  #audio .abcjs-inline-audio {
    padding: 8px 16px !important;
  }
}
```

### Stacked Layout for Mobile

```css
@media (max-width: 767px) {
  #audio .abcjs-inline-audio {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }

  /* Button row */
  #audio .abcjs-btn {
    width: 100% !important;
    justify-content: center !important;
  }

  /* Progress bar full width */
  #audio .abcjs-midi-progress-background {
    width: 100% !important;
    margin: 8px 0 !important;
  }

  /* Clock and tempo stack */
  #audio .abcjs-midi-clock,
  #audio .abcjs-tempo-wrapper {
    width: 100% !important;
    justify-content: center !important;
    text-align: center !important;
  }
}
```

## Accessibility

### Focus States

```css
/* Visible focus indicator */
#audio .abcjs-btn:focus {
  outline: 2px solid #FF6B35 !important;
  outline-offset: 2px !important;
}

#audio .abcjs-btn:focus:not(:focus-visible) {
  outline: none !important;
}

#audio .abcjs-btn:focus-visible {
  outline: 2px solid #FF6B35 !important;
  outline-offset: 2px !important;
}
```

### ARIA Labels

abcjs doesn't automatically add ARIA labels. Add them manually:

```javascript
// After SynthController loads
const playButton = document.querySelector('.abcjs-midi-start');
if (playButton) {
  playButton.setAttribute('aria-label', 'Play/Pause audio');
}

const loopButton = document.querySelector('.abcjs-midi-loop');
if (loopButton) {
  loopButton.setAttribute('aria-label', 'Toggle loop');
  loopButton.setAttribute('aria-pressed', 'false');
}
```

### Color Contrast

Ensure WCAG AA compliance:

```css
/* Minimum contrast ratio of 4.5:1 for text */
#audio .abcjs-midi-clock {
  color: #ffffff !important; /* White on #141419 = 14.32:1 ✓ */
}

/* Icon contrast */
#audio .abcjs-btn svg {
  fill: #ffffff !important;
}

/* Progress bar contrast */
#audio .abcjs-midi-progress-background {
  border: 1px solid rgba(255, 255, 255, 0.23) !important; /* Visible border */
}
```

### Reduced Motion

Respect user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  #audio .abcjs-btn,
  #audio .abcjs-midi-progress-indicator {
    transition: none !important;
  }

  /* Disable loading spinner animation */
  #audio .abcjs-loading-svg {
    animation: none !important;
  }
}
```

## Common Styling Issues

### Issue 1: Icons Too Small/Large

**Problem**: SVG icons overflow or are too tiny

**Solution**:
```css
#audio .abcjs-btn svg {
  width: 20px !important;
  height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
}
```

### Issue 2: Progress Bar Not Visible

**Problem**: Progress indicator disappears or isn't visible

**Solution**:
```css
#audio .abcjs-midi-progress-indicator {
  z-index: 2 !important;
  background: #FF6B35 !important;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.5) !important;
}
```

### Issue 3: Buttons Misaligned

**Problem**: Buttons don't align properly with other elements

**Solution**:
```css
#audio .abcjs-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
}
```

### Issue 4: Dark Theme Contrast Issues

**Problem**: Controls hard to see on dark background

**Solution**:
```css
#audio .abcjs-btn {
  border: 1px solid rgba(255, 255, 255, 0.23) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

#audio .abcjs-btn:hover {
  background: rgba(255, 255, 255, 0.12) !important;
}
```

---

**Quick Reference**: For most cases, use Strategy 1 (CSS Custom Properties) for maintainability and easy theme switching. Use Strategy 2 for precise control over specific elements. Only use Strategy 3 if you need completely custom layouts.
