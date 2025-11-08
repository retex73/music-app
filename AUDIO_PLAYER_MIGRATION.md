# Audio Player Migration Guide

## Overview

The new `TuneAudioPlayerCustom` component replaces the rigid SynthController-based implementation with a fully custom audio player using the abcjs `CreateSynth` API. This gives complete control over the UI layout, styling, and functionality while maintaining all existing features.

## Key Improvements

### Architecture
- **Custom Controls**: Replaces SynthController's pre-built DOM with custom Material-UI components
- **Two-Row Layout**: Exactly matches design mockups with transport controls on row 1 and tempo on row 2
- **React Hooks**: Manages all state with useState/useRef for predictable behavior
- **RequestAnimationFrame**: Smooth progress updates during playback without blocking the main thread

### Visual Design
- **48x48px Play Button**: Orange gradient with shadow and scale effects
- **Grouped Transport Controls**: Play, Restart, Loop buttons with visual grouping
- **Custom Progress Bar**: 8px track with hover-activated handle
- **Tempo Slider**: Separate section with dark background visual separation
- **Consistent Theming**: Fully integrated with Material-UI theme (orange #FF6B35, dark backgrounds)

### Functionality
✅ Audio playback with abcjs soundfonts
✅ Play/Pause control
✅ Restart to beginning
✅ Loop toggle
✅ Tempo/Speed control (50-200% range)
✅ Progress bar with seeking
✅ Note highlighting during playback
✅ Cursor tracking on sheet music
✅ Download MIDI
✅ Download WAV (rendered audio)
✅ Click notes on sheet to play individual notes

## Installation

### 1. Import the New Component

Replace imports in pages that use the audio player:

```jsx
// Old
import TuneAudioPlayer from '../components/TuneAudioPlayer';

// New
import TuneAudioPlayerCustom from '../components/TuneAudioPlayerCustom';
```

### 2. Use the Component

The API is identical to the old component, so no prop changes needed:

```jsx
<TuneAudioPlayerCustom
  visualObj={visualObj}
  settingId={tuneId}
/>
```

**Props:**
- `visualObj` (required): abcjs visual object containing tune data
- `settingId` (required): Unique identifier for this tune instance (used for DOM selectors)

### 3. Verify Sheet Music Container

Ensure your sheet music rendering creates a div with ID matching the pattern:

```jsx
<div id={`paper-${settingId}`}>
  {/* Your abcjs sheet music rendered here */}
</div>
```

This is critical for:
- Note click detection
- Cursor positioning during playback
- Highlight updates

## Component Architecture

### State Management

```javascript
// Playback state
const [isReady, setIsReady] = useState(false);           // Audio initialized
const [isLoading, setIsLoading] = useState(false);       // Loading soundfonts
const [isPlaying, setIsPlaying] = useState(false);       // Currently playing
const [currentTime, setCurrentTime] = useState(0);       // Current position (seconds)
const [duration, setDuration] = useState(0);             // Total duration (seconds)
const [tempo, setTempo] = useState(100);                 // Playback speed (50-200%)
const [isLooping, setIsLooping] = useState(false);       // Loop enabled
```

### Key Methods

#### `activateAudio()`
Initializes audio synthesis:
- Creates AudioContext
- Initializes CreateSynth with soundfonts
- Calculates duration
- Sets up cursor control
- **Called by**: Activation button click
- **Side effects**: Sets `isReady` to true

#### `handlePlayPause()`
Toggle playback:
- Calls `synthRef.current.play()` to start
- Calls `synthRef.current.pause()` to stop
- Starts/stops animation frame for progress updates
- **Note**: Resume from current position, not from start

#### `handleRestart()`
Reset to beginning:
- Sets `currentTime` to 0
- Stops playback if playing
- Seeks to beginning

#### `handleTempoChange(value)`
Update playback speed:
- Valid range: 50-200%
- Calls `synthRef.current.setTempo()`
- Value stored for state updates

#### `handleProgressChange(newValue)`
Seek to new position:
- Updates currentTime
- Calls `synthRef.current.seek()` when paused
- **Note**: Seeking during playback not recommended (paused seeking only)

#### `updateProgress()`
Animation frame callback:
- Gets current time from synth
- Updates state for UI
- Recursively calls itself
- **Optimization**: Uses requestAnimationFrame for smooth 60fps updates

#### `createCursorControl(tuneSettingId)`
Creates cursor control object for abcjs:
- `onStart()`: Creates SVG cursor line
- `onEvent(ev)`: Updates cursor position and note highlights
- `onFinished()`: Cleans up cursor and highlights
- **Integration**: Passed to `synth.play()` for tracking

### Refs

```javascript
const synthRef = useRef(null);                // CreateSynth instance
const audioContextRef = useRef(null);         // Web Audio API context
const cursorControlRef = useRef(null);        // Cursor control object
const animationFrameRef = useRef(null);       // RequestAnimationFrame ID
```

## CSS Styling

The component uses:
1. **Inline sx props**: Material-UI styling for responsive design
2. **TuneAudioPlayerCustom.css**: Additional styles for:
   - Cursor and note highlighting
   - Hover effects
   - Accessibility (focus states)
   - Animation keyframes
   - Responsive design
   - Reduced motion support

All colors are dark theme optimized:
- Primary orange: `#FF6B35`
- Dark background: `#141419`, `#0A0A0F`
- Text/icons: `rgba(255, 255, 255, 0.7-0.9)`

## Playback Flow

### Initialization Sequence
1. Component renders with "Activate Audio" button
2. User clicks button → `activateAudio()` starts
3. Loading spinner shown while soundfonts load
4. `CreateSynth.init()` completes
5. Duration calculated
6. `isReady` set to true
7. Audio controls become active

### Playback Sequence
1. User clicks play button → `handlePlayPause()`
2. `synthRef.current.play()` called with:
   - Cursor control object (for tracking)
   - Current audio context time
   - Current playback position
   - Loop flag
3. Animation frame loop starts (`updateProgress()`)
4. Synth generates audio and calls cursor control methods:
   - `onEvent()` called for each beat with position/notes
   - Component updates highlights and cursor
5. User can:
   - Pause (stops synth, stops animation frame)
   - Seek progress bar (only when paused)
   - Adjust tempo slider
   - Toggle loop
6. Playback ends or user stops
   - `onFinished()` cleans up highlights/cursor

### Memory Management
- Animation frame ID tracked to cancel on unmount
- Synth stopped on unmount
- Event listeners removed on unmount
- AudioContext preserved across play/pause cycles

## Browser Compatibility

- **Audio Context**: Uses `window.AudioContext` or `window.webkitAudioContext` (Safari)
- **Supported Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: Full support (requires user gesture to start audio)

## Performance Characteristics

- **Initial Load**: ~500ms-2s (depends on soundfont size)
- **Play Button Response**: <50ms
- **Tempo Change**: Immediate (slider change)
- **Progress Updates**: 60fps via requestAnimationFrame
- **Memory**: ~20-50MB for single synth instance

## Troubleshooting

### Audio Not Playing
1. Check browser console for errors
2. Verify `visualObj` is valid (required prop)
3. Check network tab - soundfonts should load from `paulrosen.github.io`
4. Verify AudioContext is not suspended (requires user interaction first)

### Cursor Not Following Music
1. Verify sheet music container ID matches pattern: `paper-{settingId}`
2. Check SVG element exists in DOM
3. Check browser console for DOM selector errors
4. Verify `visualObj.getElementFromChar()` returns valid elements

### Playback Stops After Pause
1. This is expected behavior - play resumes from current position
2. To restart, click "Restart" button
3. If seeking, only works when paused

### Progress Bar Not Updating
1. Check `updateProgress()` is being called (add console.log)
2. Verify `isPlaying` state is true
3. Check `synthRef.current.getCurrentTime()` returns valid number

### Note Clicks Not Working
1. Verify click listener attached to correct SVG
2. Check `.abcjs-note` class exists on note elements
3. Verify `data-index` attribute present on notes
4. Check `visualObj.getElementFromChar()` is defined

## Comparison with Old Component

| Feature | Old (SynthController) | New (CreateSynth) |
|---------|----------------------|-------------------|
| DOM Structure | Fixed (limited styling) | Custom (full control) |
| Layout | Single row (cramped) | Two rows (spacious) |
| Play Button | 32x32px, not prominent | 48x48px, orange gradient |
| Controls Grouping | Automatic | Custom grouping |
| Progress Bar | Fixed width | Flexible, fills available space |
| Tempo Slider | Same row | Separate section |
| Styling Framework | CSS selectors | Material-UI + CSS |
| Theme Integration | Partial | Full MUI theme |
| Customization | Limited | Unlimited |
| Note Clicking | Supported | Supported |
| Cursor Tracking | Supported | Supported |

## Migration Checklist

- [ ] Import new component in affected pages
- [ ] Update component usage (props unchanged)
- [ ] Verify sheet music container ID pattern
- [ ] Test play/pause functionality
- [ ] Test tempo slider
- [ ] Test progress bar seeking (paused only)
- [ ] Test note clicking
- [ ] Test cursor tracking during playback
- [ ] Test loop toggle
- [ ] Test restart button
- [ ] Test MIDI download
- [ ] Test WAV download
- [ ] Test on mobile devices
- [ ] Remove old TuneAudioPlayer component if not used elsewhere
- [ ] Remove TuneAudioPlayer.css if not needed

## Future Enhancements

Possible improvements for future versions:
- Keyboard shortcuts (space for play/pause, R for restart, L for loop)
- Playback speed presets (slow, normal, fast)
- Volume control slider
- Metronome option
- Recording functionality
- Visualization (waveform, spectrum)
- Keyboard navigation for all controls
- Time input field (jump to specific time)
- Theme customization (light/dark mode)
