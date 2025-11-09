# abcjs Audio API Reference

Complete API documentation for abcjs audio synthesis and playback.

## Table of Contents
1. [Core Classes](#core-classes)
2. [SynthController API](#synthcontroller-api)
3. [CreateSynth API](#createsynth-api)
4. [CursorControl API](#cursorcontrol-api)
5. [Utility Functions](#utility-functions)
6. [Configuration Options](#configuration-options)

## Core Classes

### Overview

abcjs provides two main approaches for audio playback:

1. **SynthController**: High-level widget with built-in UI controls (play, pause, progress, etc.)
2. **CreateSynth**: Low-level audio buffer for custom UI implementations

Both use the Web Audio API for synthesis and playback.

## SynthController API

### Constructor

```javascript
new ABCJS.synth.SynthController()
```

Creates a new SynthController instance with visual playback controls.

**Returns**: `SynthController` instance

**Example**:
```javascript
const synthControl = new ABCJS.synth.SynthController();
```

---

### Methods

#### `load(selector, cursorControl, visualOptions)`

Initializes the visual playback widget in the DOM.

**Parameters**:
- `selector` (string|HTMLElement): CSS selector or DOM element for the player container
- `cursorControl` (object, optional): CursorControl callback object for timing events
- `visualOptions` (object, optional): Configuration for visual controls

**visualOptions Properties**:
```javascript
{
  displayLoop: boolean,      // Show loop button (default: false)
  displayRestart: boolean,   // Show restart button (default: false)
  displayPlay: boolean,      // Show play/pause button (default: true)
  displayProgress: boolean,  // Show progress bar (default: true)
  displayWarp: boolean,      // Show tempo warp control (default: false)
  displayClock: boolean      // Show time display (default: true)
}
```

**Returns**: `void`

**Example**:
```javascript
synthControl.load("#audio", cursorControl, {
  displayLoop: true,
  displayRestart: true,
  displayPlay: true,
  displayProgress: true,
  displayWarp: true
});
```

---

#### `setTune(visualObj, userAction, audioParams)`

Loads a tune into the player for playback.

**Parameters**:
- `visualObj` (object): Visual object returned from `ABCJS.renderAbc()`
- `userAction` (boolean): `true` if called from user gesture, `false` to defer audio creation
- `audioParams` (object, optional): Audio configuration options

**audioParams Properties**:
```javascript
{
  qpm: number,              // Quarter notes per minute (tempo override)
  chordsOff: boolean,       // Disable chord playback
  program: number,          // MIDI program number (0-127)
  midiTranspose: number,    // Semitone transposition
  voicesOff: boolean|array, // Disable specific voices
  pan: array,               // Stereo panning [-1 to 1] per voice
  swing: number,            // Swing amount (50-75, default: 50)
  bassprog: number,         // Bass MIDI program
  bassvol: number,          // Bass volume (0-255)
  chordprog: number,        // Chord MIDI program
  chordvol: number          // Chord volume (0-255)
}
```

**Returns**: `Promise<object>` - Resolves when tune is loaded

**Example**:
```javascript
const visualObj = ABCJS.renderAbc("paper", abcString)[0];

synthControl.setTune(visualObj, false, {
  qpm: 120,
  program: 24,  // Nylon guitar
  pan: [-0.5, 0.5]
}).then(() => {
  console.log("Tune loaded successfully");
}).catch(error => {
  console.error("Error loading tune:", error);
});
```

---

#### `disable(isDisabled)`

Enables or disables all player controls.

**Parameters**:
- `isDisabled` (boolean): `true` to disable, `false` to enable

**Returns**: `void`

**Example**:
```javascript
// Disable during loading
synthControl.disable(true);

// Re-enable after loading
synthControl.disable(false);
```

---

#### `play()`

Starts audio playback from current position.

**Returns**: `void`

**Example**:
```javascript
synthControl.play();
```

---

#### `pause()`

Pauses audio playback at current position.

**Returns**: `void`

**Example**:
```javascript
synthControl.pause();
```

---

#### `toggleLoop()`

Toggles loop mode on/off.

**Returns**: `void`

**Example**:
```javascript
synthControl.toggleLoop();
```

---

#### `restart()`

Restarts playback from the beginning.

**Returns**: `void`

**Example**:
```javascript
synthControl.restart();
```

---

#### `setProgress(event)`

Sets playback position based on user interaction.

**Parameters**:
- `event` (Event): DOM event from progress bar interaction

**Returns**: `void`

**Usage**: Typically called automatically by progress bar click/drag

---

#### `setWarp(percent)`

Adjusts tempo by percentage (50% - 150%).

**Parameters**:
- `percent` (number): Tempo percentage (50-150)

**Returns**: `Promise<void>` - Resolves when warp is applied

**Example**:
```javascript
// Play at 125% speed
synthControl.setWarp(125).then(() => {
  console.log("Tempo adjusted");
});
```

---

## CreateSynth API

### Constructor

```javascript
new ABCJS.synth.CreateSynth()
```

Creates a low-level audio synthesis buffer without UI controls.

**Returns**: `CreateSynth` instance

**Example**:
```javascript
const synthBuffer = new ABCJS.synth.CreateSynth();
```

---

### Methods

#### `init(options)`

Initializes the synthesizer and preloads audio samples.

**Parameters**:
- `options` (object): Initialization configuration

**options Properties**:
```javascript
{
  visualObj: object,           // (Required) Visual object from renderAbc()
  audioContext: AudioContext,  // (Optional) Web Audio API context
  millisecondsPerMeasure: number, // (Optional) Timing hint
  debugCallback: function,     // (Optional) Debug logging function
  options: {
    soundFontUrl: string,      // URL to SoundFont files
    sequenceCallback: function, // Modify note sequence
    callbackContext: any,      // Context for callbacks
    onEnded: function,         // Called when playback ends
    pan: array,                // Stereo panning per voice
    program: number,           // MIDI program override
    midiTranspose: number,     // Transposition in semitones
    qpm: number,               // Tempo override
    defaultQpm: number,        // Default tempo if not in ABC
    chordsOff: boolean,        // Disable chord playback
    voicesOff: boolean|array   // Disable specific voices
  }
}
```

**Returns**: `Promise<object>` - Resolves with loaded note list

**Example**:
```javascript
const visualObj = ABCJS.renderAbc("paper", abcString)[0];
const audioContext = new AudioContext();

synthBuffer.init({
  visualObj: visualObj,
  audioContext: audioContext,
  options: {
    program: 24,
    pan: [-0.5, 0.5],
    onEnded: () => console.log("Playback complete")
  }
}).then(response => {
  console.log("Notes loaded:", response);
}).catch(error => {
  console.error("Init error:", error);
});
```

---

#### `prime()`

Builds the audio output buffer for playback.

**Returns**: `Promise<object>` - Resolves with `{duration: number, status: string}`

**Example**:
```javascript
synthBuffer.prime().then(response => {
  console.log("Buffer primed, duration:", response.duration, "seconds");
  console.log("Status:", response.status);
}).catch(error => {
  console.error("Prime error:", error);
});
```

---

#### `start()`

Starts playback of the primed audio buffer.

**Returns**: `void`

**Note**: Must call `prime()` before `start()`. The `start()` method returns quickly after priming.

**Example**:
```javascript
synthBuffer.init({visualObj})
  .then(() => synthBuffer.prime())
  .then(() => {
    synthBuffer.start();
    console.log("Playback started");
  });
```

---

#### `stop()`

Stops audio playback immediately.

**Returns**: `void`

**Example**:
```javascript
synthBuffer.stop();
```

---

#### `pause()`

Pauses audio playback at current position.

**Returns**: `void`

**Example**:
```javascript
synthBuffer.pause();
```

---

#### `resume()`

Resumes paused audio playback.

**Returns**: `void`

**Example**:
```javascript
synthBuffer.resume();
```

---

#### `seek(percent)`

Seeks to a specific position in the audio.

**Parameters**:
- `percent` (number): Position as percentage (0-100)

**Returns**: `void`

**Example**:
```javascript
// Seek to 50% through the tune
synthBuffer.seek(50);
```

---

## CursorControl API

### Interface

CursorControl is a callback object that receives timing events during playback.

**Structure**:
```javascript
const cursorControl = {
  onReady: function() { },
  onStart: function() { },
  onBeat: function(beatNumber, totalBeats, totalTime) { },
  onEvent: function(eventData) { },
  onFinished: function() { },
  beatSubdivisions: number  // Default: 2
};
```

---

### Callbacks

#### `onReady()`

Called when the audio buffer is ready for playback.

**Example**:
```javascript
onReady: function() {
  console.log("Audio is ready to play");
}
```

---

#### `onStart()`

Called when playback starts.

**Example**:
```javascript
onStart: function() {
  console.log("Playback started");
  // Create cursor SVG element
  const svg = document.querySelector("#paper svg");
  const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
  cursor.setAttribute("class", "abcjs-cursor");
  svg.appendChild(cursor);
}
```

---

#### `onBeat(beatNumber, totalBeats, totalTime)`

Called on each beat during playback.

**Parameters**:
- `beatNumber` (number): Current beat number (0-indexed)
- `totalBeats` (number): Total number of beats
- `totalTime` (number): Total playback time in milliseconds

**Example**:
```javascript
onBeat: function(beatNumber, totalBeats, totalTime) {
  console.log(`Beat ${beatNumber + 1} of ${totalBeats}`);
  console.log(`Time: ${totalTime}ms`);
}
```

---

#### `onEvent(eventData)`

Called for each musical event (note, chord, etc.) during playback.

**eventData Properties**:
```javascript
{
  elements: array,        // Array of DOM elements to highlight
  left: number,          // X position for cursor
  top: number,           // Y position for cursor
  height: number,        // Height for cursor
  measureStart: boolean  // True if this starts a new measure
}
```

**Example**:
```javascript
onEvent: function(ev) {
  // Skip second part of ties across measures
  if (ev.measureStart && ev.left === null) return;

  // Remove previous highlights
  const highlighted = document.querySelectorAll("#paper svg .highlight");
  highlighted.forEach(el => el.classList.remove("highlight"));

  // Highlight current notes
  ev.elements.forEach(noteGroup => {
    noteGroup.forEach(note => {
      note.classList.add("highlight");
    });
  });

  // Update cursor position
  const cursor = document.querySelector("#paper svg .abcjs-cursor");
  if (cursor) {
    cursor.setAttribute("x1", ev.left - 2);
    cursor.setAttribute("x2", ev.left - 2);
    cursor.setAttribute("y1", ev.top);
    cursor.setAttribute("y2", ev.top + ev.height);
  }
}
```

---

#### `onFinished()`

Called when playback finishes.

**Example**:
```javascript
onFinished: function() {
  console.log("Playback finished");
  // Clear highlights
  const highlighted = document.querySelectorAll("svg .highlight");
  highlighted.forEach(el => el.classList.remove("highlight"));

  // Reset cursor
  const cursor = document.querySelector("svg .abcjs-cursor");
  if (cursor) {
    cursor.setAttribute("x1", 0);
    cursor.setAttribute("x2", 0);
  }
}
```

---

### beatSubdivisions

Controls the frequency of `onBeat` callbacks.

**Values**:
- `1`: One callback per beat
- `2`: Two callbacks per beat (default)
- `4`: Four callbacks per beat

**Example**:
```javascript
const cursorControl = {
  beatSubdivisions: 4,  // High-frequency beat callbacks
  onBeat: function(beatNumber) {
    // Called 4 times per beat
  }
};
```

---

## Utility Functions

### `ABCJS.synth.supportsAudio()`

Checks if browser supports Web Audio API.

**Returns**: `boolean` - `true` if supported, `false` otherwise

**Example**:
```javascript
if (ABCJS.synth.supportsAudio()) {
  // Initialize audio player
} else {
  // Show error message
  console.error("Web Audio API not supported");
}
```

---

### `ABCJS.renderAbc(elementId, abcNotation, options)`

Renders ABC notation to SVG.

**Parameters**:
- `elementId` (string): DOM element ID or `"*"` for no visual output
- `abcNotation` (string): ABC notation string
- `options` (object, optional): Rendering options

**Returns**: `array` - Array of visual objects (one per tune in the ABC string)

**Example**:
```javascript
const visualObjs = ABCJS.renderAbc("paper", abcString, {
  responsive: "resize",
  add_classes: true
});

const visualObj = visualObjs[0];  // Use first tune
```

---

### `ABCJS.synth.getMidiFile(abcNotation, options)`

Generates a MIDI file link from ABC notation.

**Parameters**:
- `abcNotation` (string): ABC notation string
- `options` (object, optional): MIDI generation options

**Returns**: `string` - HTML anchor tag with MIDI download link

**Example**:
```javascript
const midiLink = ABCJS.synth.getMidiFile(abcString, {
  qpm: 120,
  program: 24
});

document.querySelector("#midi-download").innerHTML = midiLink;
```

---

## Configuration Options

### Audio Context Creation

**Best Practice**: Create AudioContext in user gesture for browser compatibility.

```javascript
// ✓ Good: Create in click handler
button.addEventListener("click", () => {
  window.AudioContext = window.AudioContext ||
                        window.webkitAudioContext ||
                        navigator.mozAudioContext ||
                        navigator.msAudioContext;
  const audioContext = new window.AudioContext();

  audioContext.resume().then(() => {
    // Initialize synth
  });
});

// ✗ Bad: Create on page load (may be blocked)
const audioContext = new AudioContext();
```

---

### MIDI Program Numbers

Common instruments (0-127):

```javascript
const instruments = {
  // Piano Family (0-7)
  acousticGrandPiano: 0,
  electricPiano: 4,

  // Chromatic Percussion (8-15)
  celesta: 8,
  glockenspiel: 9,

  // Guitar Family (24-31)
  nylonGuitar: 24,
  steelGuitar: 25,
  electricGuitar: 27,

  // Bass (32-39)
  acousticBass: 32,
  electricBass: 33,

  // Strings (40-47)
  violin: 40,
  viola: 41,
  cello: 42,

  // Ensemble (48-55)
  strings: 48,
  slowStrings: 51,

  // Brass (56-63)
  trumpet: 56,
  trombone: 57,
  frenchHorn: 60,

  // Reed (64-71)
  saxophone: 65,
  clarinet: 71,

  // Pipe (72-79)
  flute: 73,
  recorder: 74,

  // Synth (80-87)
  synthLead: 80,
  synthPad: 88
};
```

---

### Pan Configuration

Stereo panning per voice:

```javascript
{
  pan: [-1, 1]  // Left-right stereo
}

// -1.0 = full left
//  0.0 = center
//  1.0 = full right

// Example: Melody left, accompaniment right
{
  pan: [-0.5, 0.5]
}
```

---

### Tempo Configuration

Multiple ways to set tempo:

```javascript
// 1. In ABC string
const abc = `X:1
T:My Tune
Q:120  // Quarter note = 120 BPM
K:C
CDEFGAB`;

// 2. Via qpm parameter (overrides ABC)
synthControl.setTune(visualObj, false, {
  qpm: 140  // Override to 140 BPM
});

// 3. Via defaultQpm (only if not in ABC)
synthBuffer.init({
  visualObj: visualObj,
  options: {
    defaultQpm: 100  // Use if no Q: in ABC
  }
});
```

---

### Voice Configuration

Control individual voices:

```javascript
// Turn off all voices except melody
synthControl.setTune(visualObj, false, {
  voicesOff: [1, 2, 3]  // Disable voices 2, 3, 4 (0-indexed)
});

// Disable all voices (karaoke mode)
synthControl.setTune(visualObj, false, {
  voicesOff: true
});

// Custom voice volumes
synthControl.setTune(visualObj, false, {
  chordsOff: false,
  chordvol: 40,   // Quiet chords
  bassvol: 80,    // Loud bass
  program: 24     // Melody instrument
});
```

---

### SoundFont Configuration

Use custom SoundFonts:

```javascript
synthBuffer.init({
  visualObj: visualObj,
  options: {
    soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/"
  }
});

// Default SoundFont (if not specified):
// https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/
```

---

## Complete Workflow Examples

### Example 1: SynthController with Full Features

```javascript
// Check browser support
if (!ABCJS.synth.supportsAudio()) {
  alert("Audio not supported in this browser");
  return;
}

// Create cursor control
const cursorControl = {
  onStart: function() {
    const svg = document.querySelector("#paper svg");
    const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("class", "abcjs-cursor");
    cursor.setAttribute("stroke", "red");
    cursor.setAttribute("stroke-width", "2");
    svg.appendChild(cursor);
  },
  onEvent: function(ev) {
    if (ev.measureStart && ev.left === null) return;

    const highlighted = document.querySelectorAll("#paper svg .highlight");
    highlighted.forEach(el => el.classList.remove("highlight"));

    ev.elements.forEach(noteGroup => {
      noteGroup.forEach(note => note.classList.add("highlight"));
    });

    const cursor = document.querySelector("#paper svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", ev.left);
      cursor.setAttribute("x2", ev.left);
      cursor.setAttribute("y1", ev.top);
      cursor.setAttribute("y2", ev.top + ev.height);
    }
  },
  onFinished: function() {
    const highlighted = document.querySelectorAll("#paper svg .highlight");
    highlighted.forEach(el => el.classList.remove("highlight"));
  }
};

// Initialize SynthController
const synthControl = new ABCJS.synth.SynthController();
synthControl.load("#audio", cursorControl, {
  displayLoop: true,
  displayRestart: true,
  displayPlay: true,
  displayProgress: true,
  displayWarp: true
});

// Render ABC and load tune
const abcString = `X:1
T:Example Tune
M:4/4
L:1/4
K:C
CDEF|GABc|`;

const visualObj = ABCJS.renderAbc("paper", abcString, {
  responsive: "resize",
  add_classes: true
})[0];

synthControl.setTune(visualObj, false, {
  program: 24,  // Nylon guitar
  qpm: 120,
  pan: [-0.5, 0.5]
}).then(() => {
  console.log("Tune loaded successfully");
}).catch(error => {
  console.error("Error loading tune:", error);
});
```

---

### Example 2: CreateSynth with Custom Controls

```javascript
let synthBuffer = null;
let isPlaying = false;

// Render ABC
const visualObj = ABCJS.renderAbc("paper", abcString)[0];

// Initialize button
document.querySelector(".play-btn").addEventListener("click", () => {
  if (isPlaying) {
    synthBuffer.pause();
    isPlaying = false;
    document.querySelector(".play-btn").textContent = "Play";
  } else if (synthBuffer) {
    synthBuffer.resume();
    isPlaying = true;
    document.querySelector(".play-btn").textContent = "Pause";
  } else {
    // First time - initialize audio
    const audioContext = new AudioContext();
    audioContext.resume().then(() => {
      synthBuffer = new ABCJS.synth.CreateSynth();

      return synthBuffer.init({
        visualObj: visualObj,
        audioContext: audioContext,
        options: {
          program: 24,
          onEnded: () => {
            isPlaying = false;
            document.querySelector(".play-btn").textContent = "Play";
          }
        }
      });
    }).then(() => {
      return synthBuffer.prime();
    }).then(() => {
      synthBuffer.start();
      isPlaying = true;
      document.querySelector(".play-btn").textContent = "Pause";
    }).catch(error => {
      console.error("Audio error:", error);
    });
  }
});

// Stop button
document.querySelector(".stop-btn").addEventListener("click", () => {
  if (synthBuffer) {
    synthBuffer.stop();
    synthBuffer = null;
    isPlaying = false;
    document.querySelector(".play-btn").textContent = "Play";
  }
});
```

---

**Quick Reference**: Use SynthController for quick implementation with built-in UI. Use CreateSynth for custom UI and fine-grained control.
