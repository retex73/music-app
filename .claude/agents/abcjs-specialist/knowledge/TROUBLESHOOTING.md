# abcjs Troubleshooting Guide

Common issues, debugging strategies, and solutions for abcjs audio integration.

## Table of Contents
1. [Audio Initialization Issues](#audio-initialization-issues)
2. [Playback Problems](#playback-problems)
3. [Styling Issues](#styling-issues)
4. [Performance Problems](#performance-problems)
5. [Browser Compatibility](#browser-compatibility)
6. [React Integration Issues](#react-integration-issues)
7. [Debugging Strategies](#debugging-strategies)

## Audio Initialization Issues

### Issue 1: "Audio is not supported in this browser"

**Symptoms**: `ABCJS.synth.supportsAudio()` returns `false`

**Causes**:
- Browser doesn't support Web Audio API
- Browser is too old
- Running in unsupported environment (some mobile browsers)

**Solutions**:
```javascript
// Check support before initializing
if (!ABCJS.synth.supportsAudio()) {
  console.error('Browser:', navigator.userAgent);
  console.error('AudioContext available:', !!window.AudioContext);

  // Show fallback UI
  return <Alert severity="warning">
    Audio playback requires a modern browser.
    Please update your browser or try Chrome/Firefox/Safari.
  </Alert>;
}
```

**Browser Support**:
- ✅ Chrome 31+
- ✅ Firefox 25+
- ✅ Safari 7+
- ✅ Edge (Chromium)
- ❌ Internet Explorer
- ⚠️ iOS Safari (requires user gesture)

---

### Issue 2: AudioContext Suspended on iOS/Safari

**Symptoms**: No audio plays on iOS, console shows "AudioContext state: suspended"

**Cause**: iOS requires AudioContext to be created AND resumed in user gesture

**Solution**:
```javascript
const handleActivate = async () => {
  // Create AudioContext
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new window.AudioContext();

  // CRITICAL: Resume in user gesture
  await audioContext.resume();

  console.log('AudioContext state:', audioContext.state);  // Should be "running"

  // Now initialize synth
  const synth = new ABCJS.synth.CreateSynth();
  await synth.init({ visualObj, audioContext });
  await synth.prime();
  synth.start();
};

// Attach to button click
<Button onClick={handleActivate}>Play</Button>
```

---

### Issue 3: "setTune" Promise Never Resolves

**Symptoms**: `synthControl.setTune()` Promise hangs indefinitely

**Causes**:
- Visual object is null/undefined
- Visual object not from `renderAbc()`
- Network timeout loading SoundFont samples

**Debug Steps**:
```javascript
console.log('visualObj:', visualObj);
console.log('visualObj type:', typeof visualObj);
console.log('visualObj keys:', Object.keys(visualObj || {}));

// Check if visualObj is valid
if (!visualObj || !visualObj.lines) {
  console.error('Invalid visualObj - must be from ABCJS.renderAbc()');
}

// Add timeout to detect hangs
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('setTune timeout')), 10000)
);

try {
  await Promise.race([
    synthControl.setTune(visualObj, false),
    timeoutPromise
  ]);
} catch (error) {
  console.error('setTune failed:', error);
}
```

---

### Issue 4: SynthController UI Doesn't Appear

**Symptoms**: No audio controls visible after calling `load()`

**Causes**:
- DOM element doesn't exist when `load()` is called
- CSS selector is incorrect
- Element is hidden by CSS

**Solutions**:
```javascript
// Ensure DOM element exists
useEffect(() => {
  const element = document.querySelector('#audio');
  console.log('Audio container:', element);

  if (!element) {
    console.error('Container #audio not found!');
    return;
  }

  const synthControl = new ABCJS.synth.SynthController();
  synthControl.load('#audio', null, { displayPlay: true });

  // Check if controls were added
  setTimeout(() => {
    const controls = document.querySelector('#audio .abcjs-inline-audio');
    console.log('Controls rendered:', !!controls);
  }, 100);
}, []);

// JSX must have element BEFORE useEffect runs
return <div id="audio" />;  // This must be in DOM first
```

---

## Playback Problems

### Issue 5: Audio Doesn't Play When Play Button Clicked

**Symptoms**: Play button shows but clicking has no effect

**Causes**:
- Tune not loaded with `setTune()`
- AudioContext suspended
- Audio buffer not primed

**Debug Checklist**:
```javascript
// 1. Check if tune is loaded
console.log('Tune loaded:', synthControlRef.current !== null);

// 2. Check AudioContext state (if using CreateSynth)
console.log('AudioContext state:', audioContext.state);

// 3. Check if setTune was called successfully
synthControl.setTune(visualObj, false)
  .then(() => console.log('✓ Tune loaded'))
  .catch(err => console.error('✗ setTune failed:', err));

// 4. Manually trigger play after loading
synthControl.setTune(visualObj, true)  // userAction = true
  .then(() => {
    console.log('Playing automatically');
  });
```

---

### Issue 6: Audio Cuts Off or Stutters

**Symptoms**: Playback is choppy, notes skip, or audio stops mid-tune

**Causes**:
- CPU too slow (need to increase buffer size)
- Network latency loading samples
- Browser throttling background tabs
- Memory pressure

**Solutions**:
```javascript
// 1. Increase buffer size
synthBuffer.init({
  visualObj: visualObj,
  options: {
    // Preload more samples
    soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/"
  }
});

// 2. Ensure tab is active
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    synthBuffer.pause();
  } else {
    synthBuffer.resume();
  }
});

// 3. Prime buffer completely before playing
await synthBuffer.init({visualObj});
console.log('Initialized');

const primeResult = await synthBuffer.prime();
console.log('Primed, duration:', primeResult.duration);

// Wait a moment for buffer to settle
await new Promise(resolve => setTimeout(resolve, 100));

synthBuffer.start();
```

---

### Issue 7: Wrong Tempo/Speed

**Symptoms**: Tune plays too fast or too slow

**Causes**:
- Tempo in ABC notation (Q: field)
- `qpm` parameter override
- Warp setting applied

**Debug & Fix**:
```javascript
// Check tempo in visualObj
console.log('BPM from ABC:', visualObj.getBpm());
console.log('Milliseconds per measure:', visualObj.millisecondsPerMeasure());

// Override tempo
synthControl.setTune(visualObj, false, {
  qpm: 120  // Force 120 BPM
});

// Or use defaultQpm if no Q: in ABC
synthBuffer.init({
  visualObj: visualObj,
  options: {
    defaultQpm: 100  // Only used if ABC has no Q: field
  }
});

// Reset warp to 100%
synthControl.setWarp(100);
```

---

## Styling Issues

### Issue 8: Player Controls Have Wrong Colors

**Symptoms**: Controls don't match app theme, hard to see on dark background

**Cause**: abcjs default styles override custom CSS, or insufficient specificity

**Solutions**:
```css
/* Option 1: Use !important with higher specificity */
#audio .abcjs-inline-audio {
  background: #141419 !important;
  color: #ffffff !important;
}

#audio .abcjs-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
}

/* Option 2: Override abcjs-audio.css import order */
/* Import your CSS AFTER abcjs-audio.css */
import 'abcjs/abcjs-audio.css';
import './TuneAudioPlayer.css';  // Your overrides
```

---

### Issue 9: Icons Too Small or Misaligned

**Symptoms**: Play/pause icons are tiny or overflow buttons

**Cause**: SVG icon size not constrained, button sizing issues

**Fix**:
```css
/* Constrain icon size */
#audio .abcjs-btn svg {
  width: 20px !important;
  height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
}

/* Center icons in buttons */
#audio .abcjs-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 32px !important;
  min-height: 32px !important;
}
```

---

### Issue 10: Progress Bar Invisible or Not Clickable

**Symptoms**: Can't see or interact with progress bar

**Causes**:
- Low contrast on background
- Z-index issues
- Pointer events disabled

**Fix**:
```css
/* Make progress bar visible */
#audio .abcjs-midi-progress-background {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.23) !important;
  height: 10px !important;
  border-radius: 5px !important;
  cursor: pointer !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Make indicator stand out */
#audio .abcjs-midi-progress-indicator {
  background: #FF6B35 !important;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.5) !important;
  z-index: 2 !important;
  pointer-events: none !important;  /* Let clicks through to input */
}

/* Ensure range input is clickable */
#audio .abcjs-midi-progress-background input[type="range"] {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
  opacity: 0 !important;
  cursor: pointer !important;
  z-index: 3 !important;
}
```

---

## Performance Problems

### Issue 11: High CPU Usage During Playback

**Symptoms**: Browser lag, fan noise, battery drain

**Causes**:
- Cursor animation overhead
- Too frequent beat callbacks
- Inefficient note highlighting

**Optimizations**:
```javascript
// 1. Reduce beat callback frequency
const cursorControl = {
  beatSubdivisions: 1,  // Instead of 2 or 4
  onBeat: (beatNum) => {
    // Throttle updates
    if (beatNum % 2 === 0) {  // Every other beat
      setBeatInfo(beatNum);
    }
  }
};

// 2. Optimize note highlighting
onEvent: (ev) => {
  // Use requestAnimationFrame
  requestAnimationFrame(() => {
    // Batch DOM updates
    const highlighted = document.querySelectorAll('.highlight');
    highlighted.forEach(el => el.classList.remove('highlight'));

    ev.elements.forEach(noteGroup => {
      noteGroup.forEach(note => note.classList.add('highlight'));
    });
  });
}

// 3. Disable cursor if not needed
synthControl.load('#audio', null, {  // null instead of cursorControl
  displayPlay: true
});
```

---

### Issue 12: Memory Leaks

**Symptoms**: Memory usage grows over time, page becomes slow

**Causes**:
- SynthController not cleaned up
- AudioContext not closed
- Event listeners not removed

**Fix**:
```javascript
useEffect(() => {
  const synthControl = new ABCJS.synth.SynthController();
  const audioContext = new AudioContext();

  synthControl.load('#audio', null, { displayPlay: true });

  return () => {
    // CRITICAL: Clean up everything
    try {
      synthControl.disable(true);

      // Remove any event listeners
      const svg = document.querySelector('#paper svg');
      if (svg) {
        svg.removeEventListener('click', handleNoteClick);
      }

      // Close AudioContext (if using CreateSynth)
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }

      // Clear refs
      synthControlRef.current = null;
      audioContextRef.current = null;
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
  };
}, []);
```

---

## Browser Compatibility

### Issue 13: No Sound on Mobile Safari

**Symptoms**: Works on desktop, silent on iPhone/iPad

**Cause**: iOS requires AudioContext resume in user gesture + audio policy restrictions

**Solution**:
```javascript
const handlePlay = async () => {
  // iOS-specific initialization
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext();

    // MUST resume in user gesture
    await audioContext.resume();

    console.log('iOS AudioContext state:', audioContext.state);

    if (audioContext.state !== 'running') {
      alert('Please tap again to start audio');
      return;
    }
  }

  // Continue with normal initialization
  const synth = new ABCJS.synth.CreateSynth();
  // ...
};

// Make sure button is VISIBLE and clickable (not auto-triggered)
<Button onClick={handlePlay}>Play on iOS</Button>
```

---

### Issue 14: Audio Doesn't Work in Firefox Private Mode

**Symptoms**: Works in normal Firefox, fails in private browsing

**Cause**: Firefox private mode has stricter audio policies

**Solution**:
```javascript
// Detect private mode
const isPrivateMode = await (async () => {
  try {
    const db = indexedDB.open('test');
    return new Promise((resolve) => {
      db.onsuccess = () => resolve(false);
      db.onerror = () => resolve(true);
    });
  } catch {
    return true;
  }
})();

if (isPrivateMode) {
  return <Alert severity="info">
    Audio playback may not work in private browsing mode.
    Please use normal browsing for full functionality.
  </Alert>;
}
```

---

## React Integration Issues

### Issue 15: Audio Reinitializes on Every Render

**Symptoms**: Audio restarts, multiple instances created, memory leak

**Cause**: Creating new SynthController in component body or useEffect with wrong deps

**Fix**:
```javascript
// ✗ WRONG: Creates new instance on every render
const TunePlayer = () => {
  const synthControl = new ABCJS.synth.SynthController();  // BAD!
  // ...
};

// ✗ WRONG: Recreates on prop change
useEffect(() => {
  const synthControl = new ABCJS.synth.SynthController();  // BAD!
}, [visualObj]);  // Runs every time visualObj changes!

// ✓ CORRECT: Use ref, initialize once
const TunePlayer = () => {
  const synthControlRef = useRef(null);

  useEffect(() => {
    if (!synthControlRef.current) {  // Only if not already created
      synthControlRef.current = new ABCJS.synth.SynthController();
      synthControlRef.current.load('#audio', null, { displayPlay: true });
    }

    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.disable(true);
        synthControlRef.current = null;
      }
    };
  }, []);  // Empty deps - run once on mount
};
```

---

### Issue 16: "Cannot read property 'load' of null"

**Symptoms**: Error accessing synthControl methods

**Cause**: Trying to use SynthController before it's initialized

**Fix**:
```javascript
const [isInitialized, setIsInitialized] = useState(false);
const synthControlRef = useRef(null);

useEffect(() => {
  if (!synthControlRef.current) {
    synthControlRef.current = new ABCJS.synth.SynthController();
    synthControlRef.current.load('#audio', null, { displayPlay: true });
    setIsInitialized(true);  // Mark as ready
  }
}, []);

// Only call methods when initialized
const handlePlay = () => {
  if (synthControlRef.current && isInitialized) {
    synthControlRef.current.play();
  }
};
```

---

## Debugging Strategies

### General Debugging Approach

1. **Check Browser Support**
   ```javascript
   console.log('Audio supported:', ABCJS.synth.supportsAudio());
   console.log('AudioContext:', window.AudioContext);
   console.log('Browser:', navigator.userAgent);
   ```

2. **Verify DOM Elements**
   ```javascript
   console.log('Container exists:', !!document.querySelector('#audio'));
   console.log('Controls rendered:', !!document.querySelector('.abcjs-inline-audio'));
   ```

3. **Check Visual Object**
   ```javascript
   console.log('visualObj:', visualObj);
   console.log('Has lines:', !!visualObj?.lines);
   console.log('BPM:', visualObj?.getBpm?.());
   ```

4. **Monitor AudioContext State**
   ```javascript
   console.log('AudioContext state:', audioContext.state);  // Should be "running"
   ```

5. **Add Promise Error Handling**
   ```javascript
   synthControl.setTune(visualObj, false)
     .then(response => console.log('✓ Success:', response))
     .catch(error => console.error('✗ Error:', error));
   ```

---

### Network Debugging

Check SoundFont loading:

```javascript
// Open Network tab in DevTools
// Filter by "soundfont"
// Should see requests like:
// https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-ogg.js

// If 404 errors, soundfonts aren't loading
// Try different soundfont URL:
synthBuffer.init({
  visualObj: visualObj,
  options: {
    soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/"
  }
});
```

---

### React DevTools Debugging

1. Install React DevTools browser extension
2. Find TuneAudioPlayer component
3. Check props and state:
   - `visualObj` should be object with `lines` property
   - `isReady` state should be true after initialization
   - Refs should show SynthController instance

---

### Console Logging Template

```javascript
const TuneAudioPlayer = ({ visualObj, settingId }) => {
  console.log('[TuneAudioPlayer] Render:', { visualObj, settingId });

  const synthControlRef = useRef(null);

  useEffect(() => {
    console.log('[TuneAudioPlayer] Mount');

    return () => {
      console.log('[TuneAudioPlayer] Unmount');
    };
  }, []);

  const handleActivate = async () => {
    console.log('[TuneAudioPlayer] Activate start');

    try {
      console.log('[TuneAudioPlayer] Browser check');
      if (!ABCJS.synth.supportsAudio()) {
        throw new Error('Audio not supported');
      }

      console.log('[TuneAudioPlayer] Creating SynthController');
      synthControlRef.current = new ABCJS.synth.SynthController();

      console.log('[TuneAudioPlayer] Loading UI');
      synthControlRef.current.load(`#audio-${settingId}`, null, {
        displayPlay: true
      });

      console.log('[TuneAudioPlayer] Setting tune');
      await synthControlRef.current.setTune(visualObj, true);

      console.log('[TuneAudioPlayer] Activate complete');
    } catch (error) {
      console.error('[TuneAudioPlayer] Activate error:', error);
    }
  };

  return <Button onClick={handleActivate}>Activate</Button>;
};
```

---

## Quick Checklist

When audio doesn't work, check in order:

1. ✅ Browser supports Web Audio API
2. ✅ DOM element exists before `load()` call
3. ✅ `renderAbc()` returned valid visualObj
4. ✅ AudioContext created in user gesture (iOS/Safari)
5. ✅ AudioContext state is "running"
6. ✅ `setTune()` Promise resolved successfully
7. ✅ No console errors
8. ✅ Network requests for soundfonts succeeded (200 status)
9. ✅ Component cleanup properly implemented
10. ✅ No conflicting CSS hiding controls

---

**Common Quick Fixes**:
- Not working on mobile? → Ensure AudioContext resume in user gesture
- Audio cuts out? → Increase buffer size, check CPU usage
- Wrong tempo? → Check Q: field in ABC, use qpm override
- Styling broken? → Check CSS specificity, use !important
- Memory leak? → Ensure cleanup in useEffect return function
- React re-initializing? → Use ref instead of state for synth instance
