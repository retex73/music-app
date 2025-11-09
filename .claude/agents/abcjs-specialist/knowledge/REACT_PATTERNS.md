# abcjs React Integration Patterns

Best practices for integrating abcjs audio synthesis with React applications.

## Table of Contents
1. [Core Principles](#core-principles)
2. [Component Lifecycle](#component-lifecycle)
3. [State Management](#state-management)
4. [Common Patterns](#common-patterns)
5. [Performance Optimization](#performance-optimization)
6. [Error Handling](#error-handling)
7. [Testing](#testing)

## Core Principles

### 1. Refs for External Libraries

abcjs creates DOM elements and manages state outside React's control. Use refs to maintain references without triggering re-renders.

**Why**: Storing synth instances in state causes unnecessary re-renders and re-initialization.

**Pattern**:
```javascript
const synthControlRef = useRef(null);  // ✓ Good
const [synthControl, setSynthControl] = useState(null);  // ✗ Bad
```

---

### 2. User Gesture Requirement

Browser audio policies require AudioContext creation in response to user interaction.

**Why**: Browsers block auto-playing audio to improve UX.

**Pattern**:
```javascript
// ✓ Good: Initialize in click handler
const handleActivate = () => {
  const audioContext = new AudioContext();
  audioContext.resume().then(() => {
    // Initialize synth
  });
};

// ✗ Bad: Initialize on mount
useEffect(() => {
  const audioContext = new AudioContext();  // May be blocked!
}, []);
```

---

### 3. Cleanup on Unmount

Always clean up audio resources to prevent memory leaks.

**Why**: AudioContext and synth buffers consume memory.

**Pattern**:
```javascript
useEffect(() => {
  // Initialize

  return () => {
    // Cleanup
    if (synthControlRef.current) {
      synthControlRef.current.disable(true);
      synthControlRef.current = null;
    }
  };
}, []);
```

---

## Component Lifecycle

### Pattern 1: Lazy Initialization (Recommended)

**Use When**: User might not need audio immediately

```javascript
import React, { useState, useRef, useEffect } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';

const TuneAudioPlayer = ({ visualObj, settingId }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const synthControlRef = useRef(null);
  const audioContainerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthControlRef.current) {
        try {
          synthControlRef.current.disable(true);
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
        synthControlRef.current = null;
      }
    };
  }, []);

  const handleActivate = async () => {
    if (!abcjs.synth.supportsAudio()) {
      setError('Audio not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create SynthController (once)
      if (!synthControlRef.current) {
        synthControlRef.current = new abcjs.synth.SynthController();
        synthControlRef.current.load(
          `#audio-${settingId}`,
          null,  // cursorControl optional
          {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: false
          }
        );
      }

      // Set tune
      await synthControlRef.current.setTune(visualObj, true);

      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to initialize audio');
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        Error: {error}
      </Box>
    );
  }

  if (!isReady) {
    return (
      <Button
        variant="contained"
        onClick={handleActivate}
        disabled={isLoading}
      >
        {isLoading ? 'Loading Audio...' : 'Activate Audio'}
      </Button>
    );
  }

  return (
    <Box>
      <div id={`audio-${settingId}`} ref={audioContainerRef} />
    </Box>
  );
};

export default TuneAudioPlayer;
```

---

### Pattern 2: Eager Initialization

**Use When**: Audio will definitely be used

```javascript
const TuneAudioPlayer = ({ visualObj, settingId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const synthControlRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAudio = async () => {
      if (!abcjs.synth.supportsAudio()) {
        setError('Audio not supported');
        return;
      }

      try {
        synthControlRef.current = new abcjs.synth.SynthController();
        synthControlRef.current.load(`#audio-${settingId}`, null, {
          displayLoop: true,
          displayPlay: true,
          displayProgress: true
        });

        // Note: Don't call setTune here - requires user gesture
        // Just prepare the UI
        if (isMounted) {
          setIsReady(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    initializeAudio();

    return () => {
      isMounted = false;
      if (synthControlRef.current) {
        synthControlRef.current.disable(true);
        synthControlRef.current = null;
      }
    };
  }, [settingId]);

  // Load tune when visualObj changes
  useEffect(() => {
    if (isReady && visualObj && synthControlRef.current) {
      synthControlRef.current.setTune(visualObj, false)
        .catch(err => setError(err.message));
    }
  }, [visualObj, isReady]);

  return <div id={`audio-${settingId}`} />;
};
```

---

### Pattern 3: Custom CreateSynth (Advanced)

**Use When**: Need full control over UI and playback

```javascript
const CustomAudioPlayer = ({ visualObj }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const synthBufferRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (synthBufferRef.current) {
        synthBufferRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      synthBufferRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (synthBufferRef.current) {
      synthBufferRef.current.resume();
      setIsPlaying(true);
      return;
    }

    // First time initialization
    try {
      audioContextRef.current = new AudioContext();
      await audioContextRef.current.resume();

      synthBufferRef.current = new abcjs.synth.CreateSynth();

      await synthBufferRef.current.init({
        visualObj: visualObj,
        audioContext: audioContextRef.current,
        options: {
          program: 24,
          onEnded: () => setIsPlaying(false)
        }
      });

      const response = await synthBufferRef.current.prime();
      setDuration(response.duration);

      synthBufferRef.current.start();
      setIsPlaying(true);

      // Track progress
      const interval = setInterval(() => {
        // Calculate progress (abcjs doesn't expose current time directly)
        // You would need custom tracking here
      }, 100);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  return (
    <Box>
      <IconButton onClick={handlePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Slider
        value={progress}
        max={duration}
        onChange={(e, value) => {
          const percent = (value / duration) * 100;
          synthBufferRef.current?.seek(percent);
          setProgress(value);
        }}
      />
    </Box>
  );
};
```

---

## State Management

### What to Track in State

```javascript
const TuneAudioPlayer = () => {
  // ✓ Good: UI state
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [beatInfo, setBeatInfo] = useState('');

  // ✓ Good: External library instances
  const synthControlRef = useRef(null);
  const audioContextRef = useRef(null);
  const midiBufferRef = useRef(null);

  // ✗ Bad: Don't store synth in state
  const [synthControl, setSynthControl] = useState(null);  // Causes re-renders!
};
```

---

### Derived State

**Problem**: Tracking playback state when using SynthController

**Solution**: Use CursorControl callbacks to update React state

```javascript
const TuneAudioPlayer = ({ visualObj }) => {
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const cursorControl = useMemo(() => ({
    onStart: () => setIsPlaying(true),
    onBeat: (beatNum, total) => {
      setCurrentBeat(beatNum);
      setTotalBeats(total);
    },
    onFinished: () => setIsPlaying(false)
  }), []);

  useEffect(() => {
    const synthControl = new abcjs.synth.SynthController();
    synthControl.load('#audio', cursorControl, {
      displayPlay: true,
      displayProgress: true
    });

    // ... rest of initialization
  }, [cursorControl]);

  return (
    <Box>
      <div id="audio" />
      <Typography>
        Beat {currentBeat + 1} of {totalBeats}
      </Typography>
      {isPlaying && <LinearProgress />}
    </Box>
  );
};
```

---

## Common Patterns

### Pattern 4: Multiple Tunes

**Use Case**: Playlist or multiple tune settings

```javascript
const TunePlaylist = ({ tunes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const synthControlRef = useRef(null);

  useEffect(() => {
    if (!abcjs.synth.supportsAudio()) return;

    synthControlRef.current = new abcjs.synth.SynthController();
    synthControlRef.current.load('#audio', null, {
      displayPlay: true,
      displayProgress: true
    });

    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.disable(true);
        synthControlRef.current = null;
      }
    };
  }, []);

  // Load new tune when index changes
  useEffect(() => {
    if (synthControlRef.current && tunes[currentIndex]) {
      const visualObj = abcjs.renderAbc('*', tunes[currentIndex].abc)[0];
      synthControlRef.current.setTune(visualObj, false)
        .catch(err => console.error('Error loading tune:', err));
    }
  }, [currentIndex, tunes]);

  return (
    <Box>
      <div id="audio" />
      <ButtonGroup>
        <Button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentIndex(i => Math.min(tunes.length - 1, i + 1))}
          disabled={currentIndex === tunes.length - 1}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  );
};
```

---

### Pattern 5: MIDI Download

**Use Case**: Provide MIDI file download

```javascript
const TuneWithMIDI = ({ abcNotation }) => {
  const [midiUrl, setMidiUrl] = useState(null);

  useEffect(() => {
    // Generate MIDI file
    const midiLink = abcjs.synth.getMidiFile(abcNotation);

    // Extract href from generated <a> tag
    const parser = new DOMParser();
    const doc = parser.parseFromString(midiLink, 'text/html');
    const anchor = doc.querySelector('a');

    if (anchor) {
      setMidiUrl(anchor.href);
    }
  }, [abcNotation]);

  return (
    <Box>
      {midiUrl && (
        <Button
          component="a"
          href={midiUrl}
          download="tune.midi"
          variant="outlined"
        >
          Download MIDI
        </Button>
      )}
    </Box>
  );
};
```

---

### Pattern 6: Note Click Interaction

**Use Case**: Click notes to hear them

```javascript
const InteractiveTune = ({ visualObj }) => {
  useEffect(() => {
    const svg = document.querySelector('#paper svg');
    if (!svg) return;

    const handleNoteClick = (event) => {
      const note = event.target.closest('.abcjs-note');
      if (note) {
        // Play single note (custom implementation needed)
        const pitch = note.dataset.pitch;
        console.log('Clicked note:', pitch);
      }
    };

    svg.addEventListener('click', handleNoteClick);

    return () => {
      svg.removeEventListener('click', handleNoteClick);
    };
  }, [visualObj]);

  return (
    <Box>
      <div id="paper" />
    </Box>
  );
};
```

---

## Performance Optimization

### 1. Memoize Callbacks

```javascript
const TuneAudioPlayer = ({ visualObj, settingId }) => {
  // ✓ Good: Memoized cursor control
  const cursorControl = useMemo(() => ({
    onStart: () => console.log('Started'),
    onEvent: (ev) => { /* highlight notes */ },
    onFinished: () => console.log('Finished')
  }), []);

  // ✗ Bad: New object on every render
  const cursorControl = {
    onStart: () => console.log('Started')  // Re-creates on every render!
  };
};
```

---

### 2. Avoid Re-initialization

```javascript
const TuneAudioPlayer = ({ visualObj }) => {
  const synthControlRef = useRef(null);

  useEffect(() => {
    // ✓ Good: Initialize only once
    if (!synthControlRef.current && abcjs.synth.supportsAudio()) {
      synthControlRef.current = new abcjs.synth.SynthController();
      synthControlRef.current.load('#audio', null, { displayPlay: true });
    }

    return () => {
      if (synthControlRef.current) {
        synthControlRef.current.disable(true);
        synthControlRef.current = null;
      }
    };
  }, []);  // Empty deps - run once

  // ✗ Bad: Reinitializes on every visualObj change
  useEffect(() => {
    const synthControl = new abcjs.synth.SynthController();  // Memory leak!
    synthControl.load('#audio', null, { displayPlay: true });
  }, [visualObj]);  // Runs every time visualObj changes
};
```

---

### 3. Lazy Load Audio

```javascript
const TuneAudioPlayer = ({ visualObj }) => {
  const [audioActivated, setAudioActivated] = useState(false);

  // Only initialize after user activates
  useEffect(() => {
    if (!audioActivated) return;

    const synthControl = new abcjs.synth.SynthController();
    synthControl.load('#audio', null, { displayPlay: true });
    synthControl.setTune(visualObj, true);

    return () => {
      synthControl.disable(true);
    };
  }, [audioActivated, visualObj]);

  return (
    <Box>
      {!audioActivated ? (
        <Button onClick={() => setAudioActivated(true)}>
          Activate Audio
        </Button>
      ) : (
        <div id="audio" />
      )}
    </Box>
  );
};
```

---

### 4. Debounce Tune Changes

```javascript
import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

const TuneEditor = ({ abcNotation }) => {
  const [visualObj, setVisualObj] = useState(null);
  const synthControlRef = useRef(null);

  // Debounce rendering to avoid excessive updates
  const updateVisual = useMemo(
    () => debounce((abc) => {
      const newVisualObj = abcjs.renderAbc('paper', abc)[0];
      setVisualObj(newVisualObj);
    }, 500),
    []
  );

  useEffect(() => {
    updateVisual(abcNotation);
  }, [abcNotation, updateVisual]);

  // Update audio only when visual is finalized
  useEffect(() => {
    if (synthControlRef.current && visualObj) {
      synthControlRef.current.setTune(visualObj, false);
    }
  }, [visualObj]);

  return <div id="paper" />;
};
```

---

## Error Handling

### Pattern 7: Comprehensive Error Boundaries

```javascript
class AudioErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Audio error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, bgcolor: 'error.dark', color: 'error.contrastText' }}>
          <Typography variant="h6">Audio Player Error</Typography>
          <Typography>{this.state.error?.message}</Typography>
          <Button onClick={() => this.setState({ hasError: false })}>
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Usage
<AudioErrorBoundary>
  <TuneAudioPlayer visualObj={visualObj} />
</AudioErrorBoundary>
```

---

### Pattern 8: Graceful Degradation

```javascript
const TuneAudioPlayer = ({ visualObj }) => {
  const [audioSupported, setAudioSupported] = useState(true);

  useEffect(() => {
    if (!abcjs.synth.supportsAudio()) {
      setAudioSupported(false);
    }
  }, []);

  if (!audioSupported) {
    return (
      <Alert severity="warning">
        Audio playback is not supported in this browser.
        Please try Chrome, Firefox, or Safari.
      </Alert>
    );
  }

  return <div id="audio" />;
};
```

---

## Testing

### Unit Test Example (Jest + React Testing Library)

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TuneAudioPlayer from './TuneAudioPlayer';

// Mock abcjs
jest.mock('abcjs', () => ({
  synth: {
    supportsAudio: jest.fn(() => true),
    SynthController: jest.fn().mockImplementation(() => ({
      load: jest.fn(),
      setTune: jest.fn(() => Promise.resolve()),
      disable: jest.fn()
    }))
  }
}));

describe('TuneAudioPlayer', () => {
  const mockVisualObj = { /* mock visual object */ };

  it('renders activate button initially', () => {
    render(<TuneAudioPlayer visualObj={mockVisualObj} settingId="test" />);
    expect(screen.getByText('Activate Audio')).toBeInTheDocument();
  });

  it('initializes audio on button click', async () => {
    render(<TuneAudioPlayer visualObj={mockVisualObj} settingId="test" />);

    const button = screen.getByText('Activate Audio');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Activate Audio')).not.toBeInTheDocument();
    });
  });

  it('shows error when audio not supported', async () => {
    const abcjs = require('abcjs');
    abcjs.synth.supportsAudio.mockReturnValue(false);

    render(<TuneAudioPlayer visualObj={mockVisualObj} settingId="test" />);

    const button = screen.getByText('Activate Audio');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Audio not supported/i)).toBeInTheDocument();
    });
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <TuneAudioPlayer visualObj={mockVisualObj} settingId="test" />
    );

    unmount();

    // Verify cleanup was called (check mock calls if needed)
  });
});
```

---

## Best Practices Summary

1. **Use Refs**: Store synth instances in refs, not state
2. **User Gesture**: Initialize audio in click/tap handlers
3. **Cleanup**: Always clean up in useEffect return function
4. **Memoization**: Memoize callbacks to avoid re-initialization
5. **Error Handling**: Implement error boundaries and graceful degradation
6. **Performance**: Lazy load, debounce updates, avoid re-initialization
7. **Accessibility**: Add ARIA labels, ensure keyboard navigation
8. **Testing**: Mock abcjs for unit tests

---

**Quick Decision Tree**:
- Need built-in UI? → Use SynthController
- Need custom UI? → Use CreateSynth
- Multiple tunes? → Single SynthController, call setTune() for each
- Performance critical? → Lazy load, memoize callbacks, debounce updates
- Production app? → Add error boundaries, graceful degradation
