# abcjs Skill

Quick-reference skill for abcjs library (ABC music notation rendering and audio synthesis).

## When to Use This Skill

Invoke this skill when you need help with:
- ✅ abcjs audio player configuration and styling
- ✅ SynthController API usage and troubleshooting
- ✅ React integration with abcjs
- ✅ Audio playback issues and debugging
- ✅ CSS customization for audio controls
- ✅ ABC notation rendering
- ✅ MIDI generation and export

## Library Information

**Name**: abcjs
**Version**: v6.4.3
**NPM**: `npm install abcjs`
**Docs**: https://github.com/paulrosen/abcjs
**Purpose**: JavaScript library for rendering ABC music notation and synthesizing audio playback

## Quick Commands

### Basic Audio Setup

```javascript
// 1. Check browser support
if (ABCJS.synth.supportsAudio()) {
  // 2. Create controller
  const synthControl = new ABCJS.synth.SynthController();

  // 3. Load UI into DOM
  synthControl.load("#audio", null, {
    displayLoop: true,
    displayRestart: true,
    displayPlay: true,
    displayProgress: true,
    displayWarp: false
  });

  // 4. Render ABC notation
  const visualObj = ABCJS.renderAbc("paper", abcString)[0];

  // 5. Load tune
  await synthControl.setTune(visualObj, false);
}
```

### React Component Pattern

```javascript
import { useRef, useEffect, useState } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';

const TunePlayer = ({ visualObj }) => {
  const synthControlRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!synthControlRef.current && abcjs.synth.supportsAudio()) {
      synthControlRef.current = new abcjs.synth.SynthController();
      synthControlRef.current.load('#audio', null, {
        displayPlay: true,
        displayProgress: true
      });
    }

    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.disable(true);
        synthControlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (synthControlRef.current && visualObj) {
      synthControlRef.current.setTune(visualObj, false)
        .then(() => setIsReady(true))
        .catch(err => console.error(err));
    }
  }, [visualObj]);

  return <div id="audio" />;
};
```

### CSS Customization

```css
/* Match Material-UI dark theme */
#audio .abcjs-inline-audio {
  background: #141419 !important;
  color: #ffffff !important;
  padding: 12px !important;
  border-radius: 8px !important;
}

/* Style buttons */
#audio .abcjs-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px !important;
  min-width: 32px !important;
  min-height: 32px !important;
}

/* Icon sizing */
#audio .abcjs-btn svg {
  width: 20px !important;
  height: 20px !important;
}

/* Progress bar */
#audio .abcjs-midi-progress-indicator {
  background: #FF6B35 !important;
}
```

## Common Issues & Quick Fixes

### Issue: No audio on iOS/Safari
**Fix**: Create AudioContext in user gesture and resume
```javascript
const audioContext = new AudioContext();
await audioContext.resume();  // MUST be in click handler
```

### Issue: Audio player not visible
**Fix**: Ensure DOM element exists before load()
```javascript
// DOM element MUST exist first
return (
  <>
    <div id="audio" />  {/* This first */}
    {/* Then useEffect runs */}
  </>
);
```

### Issue: Icons misaligned
**Fix**: Add flexbox centering
```css
#audio .abcjs-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
```

### Issue: Re-initializing on every render
**Fix**: Use ref, not state
```javascript
const synthControlRef = useRef(null);  // ✓ Good
const [synthControl, setSynthControl] = useState(null);  // ✗ Bad
```

### Issue: Memory leak
**Fix**: Cleanup in useEffect return
```javascript
useEffect(() => {
  // Initialize
  return () => {
    if (synthControlRef.current) {
      synthControlRef.current.disable(true);
      synthControlRef.current = null;
    }
  };
}, []);
```

## API Quick Reference

### SynthController Methods
- `load(selector, cursorControl, options)` - Initialize UI
- `setTune(visualObj, userAction, audioParams)` - Load tune
- `play()` - Start playback
- `pause()` - Pause playback
- `restart()` - Restart from beginning
- `toggleLoop()` - Toggle loop mode
- `disable(boolean)` - Enable/disable controls
- `setWarp(percent)` - Adjust tempo (50-150%)

### CreateSynth Methods
- `init(options)` - Initialize synth buffer
- `prime()` - Build audio buffer
- `start()` - Start playback
- `stop()` - Stop playback
- `pause()` - Pause playback
- `resume()` - Resume playback
- `seek(percent)` - Seek to position

### Configuration Options
```javascript
// Visual options
{
  displayLoop: boolean,
  displayRestart: boolean,
  displayPlay: boolean,
  displayProgress: boolean,
  displayWarp: boolean
}

// Audio params
{
  qpm: number,           // Tempo (BPM)
  program: number,       // MIDI instrument (0-127)
  pan: array,           // Stereo [-1, 1]
  chordsOff: boolean,   // Disable chords
  voicesOff: array      // Disable voices
}
```

## CSS Classes Reference

| Class | Element | Purpose |
|-------|---------|---------|
| `.abcjs-inline-audio` | Main container | Player wrapper |
| `.abcjs-btn` | All buttons | Play, pause, loop, restart |
| `.abcjs-midi-start` | Play/pause button | Primary control |
| `.abcjs-midi-reset` | Restart button | Reset playback |
| `.abcjs-midi-loop` | Loop button | Toggle loop |
| `.abcjs-pushed` | Active button | Toggle state indicator |
| `.abcjs-midi-progress-background` | Progress bar container | Clickable track |
| `.abcjs-midi-progress-indicator` | Progress thumb | Playhead position |
| `.abcjs-midi-clock` | Time display | Current/total time |
| `.abcjs-midi-tempo` | Tempo input | BPM adjustment |
| `.abcjs-warp-slider` | Warp control | Tempo variation |

## Decision Tree

**Need help with...**

- 🎵 **Audio not playing?** → Check browser support, AudioContext state, user gesture
- 🎨 **Styling issues?** → See CSS customization patterns, check specificity
- ⚛️ **React integration?** → Use refs for synth, cleanup in useEffect
- 🐛 **Debugging?** → Check console, verify visualObj, test network requests
- 📱 **Mobile/iOS issues?** → AudioContext resume in click handler required
- 🎛️ **Custom UI?** → Use CreateSynth instead of SynthController
- 📝 **ABC rendering?** → Use `ABCJS.renderAbc()` before audio setup

## For Complex Issues

This skill provides quick reference. For comprehensive help:

**Invoke the abcjs-specialist agent** located at:
`.claude/agents/abcjs-specialist/AGENT.md`

The specialist agent provides:
- Complete API documentation
- Advanced React patterns
- Performance optimization
- Browser compatibility strategies
- Debugging workflows
- Accessibility best practices

## Additional Resources

**Knowledge Base Files**:
- [STYLING.md](../.claude/agents/abcjs-specialist/knowledge/STYLING.md) - Complete CSS reference
- [API.md](../.claude/agents/abcjs-specialist/knowledge/API.md) - Full API documentation
- [REACT_PATTERNS.md](../.claude/agents/abcjs-specialist/knowledge/REACT_PATTERNS.md) - React integration
- [TROUBLESHOOTING.md](../.claude/agents/abcjs-specialist/knowledge/TROUBLESHOOTING.md) - Common issues

**Official Documentation**:
- GitHub: https://github.com/paulrosen/abcjs
- Examples: https://paulrosen.github.io/abcjs/
- Audio Docs: https://github.com/paulrosen/abcjs/blob/main/docs/audio/synthesized-sound.md

---

**Quick Start Checklist**:
1. ✅ Install: `npm install abcjs`
2. ✅ Import: `import abcjs from 'abcjs'` and `import 'abcjs/abcjs-audio.css'`
3. ✅ Check support: `ABCJS.synth.supportsAudio()`
4. ✅ Create controller: `new ABCJS.synth.SynthController()`
5. ✅ Load UI: `synthControl.load('#audio', null, options)`
6. ✅ Render ABC: `const visualObj = ABCJS.renderAbc("paper", abc)[0]`
7. ✅ Set tune: `await synthControl.setTune(visualObj, false)`
8. ✅ Cleanup: Use refs, cleanup in useEffect return

**Last Updated**: 2025-01-05
**Library Version**: abcjs v6.4.3
