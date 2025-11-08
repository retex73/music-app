# Audio Player Quick Reference

## Component Summary

**File**: `src/components/TuneAudioPlayerCustom.jsx`
**Styles**: `src/components/TuneAudioPlayerCustom.css`
**API**: Identical to old `TuneAudioPlayer` component

## Installation (30 seconds)

```jsx
// 1. Import
import TuneAudioPlayerCustom from '../components/TuneAudioPlayerCustom';

// 2. Use (props unchanged)
<TuneAudioPlayerCustom
  visualObj={visualObj}
  settingId={settingId}
/>

// 3. Verify sheet music container ID format
<div id={`paper-${settingId}`}>
  {/* Your abcjs sheet music rendered here */}
</div>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visualObj` | abcjs object | Yes | Output from `abcjs.renderAbc()` |
| `settingId` | string/number | Yes | Unique ID (used for DOM selectors) |

## Key Features

✅ **Two-row layout** - Transport controls + Tempo section
✅ **48x48px play button** - Orange gradient, prominent
✅ **Custom progress bar** - Fills available space, smooth drag
✅ **Full playback control** - Play, pause, restart, loop
✅ **Tempo adjustment** - 50-200% range
✅ **Sheet music integration** - Cursor tracking, note clicking
✅ **Download support** - MIDI and WAV export
✅ **Fully responsive** - Desktop, tablet, mobile
✅ **Accessible** - Keyboard navigation, WCAG AA compliant
✅ **Dark theme** - Integrated with Material-UI theme

## Visual Hierarchy

### Row 1: Transport Controls
- **Play/Pause**: 48x48px, orange gradient, primary action
- **Restart**: 32x32px, secondary button
- **Loop**: 32x32px, toggleable state
- **Progress bar**: Flexible width, fills available space
- **Time display**: MM:SS.ms format

### Row 2: Tempo Control
- **Label**: "TEMPO" (uppercase, small)
- **Slider**: 50-200% range
- **Value**: Percentage display

## Controls Reference

### Play Button (48x48px)
- **Inactive**: Play icon, orange gradient
- **Active**: Pause icon, orange gradient
- **Hover**: Scale up, enhanced shadow
- **Click**: Toggle playback

### Transport Buttons (32x32px)
- **Restart**: Reset to beginning, stop playback
- **Loop**: Toggle repeat on/off, state indicator
- **Hover**: Scale up, background highlight

### Progress Bar
- **Track**: 8px height, light gray
- **Fill**: Orange gradient
- **Handle**: Appears on hover, draggable when paused
- **Time**: Current / Total duration

### Tempo Slider
- **Range**: 50-200%
- **Step**: 1%
- **Display**: Current percentage
- **Real-time**: Updates playback speed immediately

## State Management

```javascript
isReady        // Audio initialized and ready to play
isLoading      // Soundfonts loading
isPlaying      // Currently playing audio
currentTime    // Current playback position (seconds)
duration       // Total tune duration (seconds)
tempo          // Playback speed (50-200%)
isLooping      // Loop enabled/disabled
```

## Method Reference

### Public Methods (accessed via ref)
```javascript
const playerRef = useRef(null);

// (Not directly called - use UI buttons instead)
```

### Internal Methods (used by component)
```javascript
activateAudio()              // Initialize audio synthesis
handlePlayPause()            // Toggle play/pause
handleRestart()              // Reset to beginning
handleLoopToggle()           // Toggle loop on/off
handleTempoChange(value)     // Update playback speed
handleProgressChange(value)  // Seek to position
```

## Common Tasks

### Change Default Tempo
Edit line in component:
```javascript
const [tempo, setTempo] = useState(120); // Change from 100
```

### Change Tempo Range
Edit in `handleTempoChange` slider:
```jsx
<Slider
  min={50}      // Change minimum
  max={200}     // Change maximum
  step={1}      // Change step size
/>
```

### Change Color Scheme
Edit sx props - look for:
```javascript
background: "linear-gradient(135deg, #FF6B35 0%, #FF8855 100%)"
// Replace with your colors
```

### Add Volume Control
1. Add state: `const [volume, setVolume] = useState(1);`
2. Create slider (similar to tempo)
3. Call: `synthRef.current.setVolume(volume)`

### Disable Loop Button
Find loop button and add `disabled={true}`

### Remove Download Buttons
Delete the download buttons section or conditional render

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| No sound | Check soundfont URLs load (Network tab) |
| Cursor not tracking | Verify `paper-{settingId}` container exists |
| Progress not updating | Check `updateProgress()` being called |
| Buttons disabled | Ensure `visualObj` is valid |
| Tempo not working | Check synth is initialized before seeking |
| Notes not clickable | Verify `.abcjs-note` classes on SVG elements |

## Browser DevTools Inspection

### Check Synth Status
```javascript
// In console (if you expose synthRef)
window.synth = synthRef.current;
window.synth.getCurrentTime();     // Current playback time
window.synth.getDuration();        // Total duration
```

### Monitor State Changes
```javascript
// In console
// Add console.log to state setters to debug
```

### Verify DOM Structure
1. Open DevTools Inspector
2. Find `#paper-{settingId}` element
3. Verify `<svg>` child exists
4. Check for `.abcjs-note` classes on notes
5. Verify `.abcjs-cursor` line exists during playback

## Performance Tips

- ✅ Only render after `visualObj` ready (show loading spinner)
- ✅ Use unique `settingId` for each tune instance
- ✅ Let animation frame update progress (don't force updates)
- ✅ Keep soundfont URL (CDN provides caching)
- ✅ Memoize visualObj if parent frequently re-renders

## CSS Customization

### Change Orange Color
```css
/* In TuneAudioPlayerCustom.css or component */
Search for #FF6B35 and #FF8855
Replace with your brand color
```

### Change Button Sizes
```javascript
// In component sx props
width: 48,    // Play button width
height: 48,   // Play button height
// Edit directly
```

### Change Progress Bar Height
```jsx
Slider sx={{
  height: 8,  // Track height
  // Edit directly
}}
```

### Add Custom Animations
```css
/* In TuneAudioPlayerCustom.css */
@keyframes yourAnimation {
  /* Your keyframes */
}
```

## Accessibility Checklist

✅ Color contrast: Orange (#FF6B35) on dark bg meets WCAG AA
✅ Focus states: Orange outline visible on all controls
✅ Keyboard nav: Tab through all controls
✅ Labels: All buttons have aria-labels or visible text
✅ Reduced motion: Respects `prefers-reduced-motion` setting
✅ Touch targets: 44x44px minimum (48x48px play button)
✅ SVG scaling: Icons scale with buttons

## Material-UI Integration

Component uses MUI v6:
- `@mui/material` components (Box, Button, Slider, etc.)
- `@mui/icons-material` icons (PlayArrow, Pause, etc.)
- Theme colors: Primary orange (#FF6B35)
- Dark theme: Integrated with darkTheme.js

Ensure your app wraps with:
```jsx
<ThemeProvider theme={darkTheme}>
  {/* Your app */}
</ThemeProvider>
```

## Files Reference

| File | Purpose |
|------|---------|
| `TuneAudioPlayerCustom.jsx` | Main component (production code) |
| `TuneAudioPlayerCustom.css` | Styling and animations |
| `AUDIO_PLAYER_MIGRATION.md` | Detailed migration guide |
| `AUDIO_PLAYER_EXAMPLE.jsx` | Usage examples |
| `AUDIO_PLAYER_TESTING.md` | Testing guide |
| `AUDIO_PLAYER_QUICK_REFERENCE.md` | This file |

## Dependencies

```json
{
  "abcjs": "^6.4.3",           // ABC notation rendering & synthesis
  "@mui/material": "^6.1.6",   // UI components
  "@mui/icons-material": "^6.1.5", // Icons
  "react": "^18.3.1",          // React library
}
```

All dependencies already in your package.json ✅

## API Compatibility

### Old Component (SynthController)
```jsx
<TuneAudioPlayer visualObj={obj} settingId={id} />
```

### New Component (CreateSynth)
```jsx
<TuneAudioPlayerCustom visualObj={obj} settingId={id} />
```

**Props are identical** - drop-in replacement ✅

## Next Steps

1. **Copy files** to your project
2. **Update imports** in pages using audio player
3. **Run tests** to verify functionality
4. **Deploy** to production
5. **Monitor** for any issues

See `AUDIO_PLAYER_MIGRATION.md` for detailed steps.

## Support Resources

- **AUDIO_PLAYER_MIGRATION.md** - Full migration guide
- **AUDIO_PLAYER_EXAMPLE.jsx** - Working code examples
- **AUDIO_PLAYER_TESTING.md** - Testing procedures
- **abcjs documentation** - https://paulrosen.github.io/abcjs/
- **Material-UI docs** - https://mui.com/

## Version Info

- **Component**: v1.0
- **Created**: 2025
- **Framework**: React 18+
- **MUI**: v6+
- **abcjs**: v6.4.3+

---

**Last Updated**: 2025-11-06
**Status**: Production Ready ✅
