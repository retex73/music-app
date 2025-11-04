# ABC Notation Skill

## Purpose
Master ABC music notation rendering using abcjs library for displaying sheet music in the music-app project.

## ABC Format Basics

```abc
X:1                     % Reference number (required)
T:The Butterfly        % Title (required)
R:slip jig             % Rhythm/Type
M:9/8                  % Meter (time signature)
L:1/8                  % Default note length
K:Emin                 % Key signature (required)
|:B2E G2E F3|B2E G2E FED|B2E G2E F3|B2d d2B AFD:|
|:B2c e2f g3|B2d g2e dBA|B2c e2f g2a|b2a g2e dBA:|
```

## abcjs Integration

### Basic Rendering
```javascript
import abcjs from 'abcjs';
import { useEffect, useRef } from 'react';

function SheetMusic({ abcNotation }) {
  const notationRef = useRef(null);

  useEffect(() => {
    if (notationRef.current && abcNotation) {
      try {
        abcjs.renderAbc(notationRef.current, abcNotation, {
          responsive: 'resize',
          staffwidth: 600,
          scale: 1.0,
          add_classes: true
        });
      } catch (error) {
        console.error('ABC rendering error:', error);
      }
    }
  }, [abcNotation]);

  return <div ref={notationRef} />;
}
```

### Sheet Music Modal
```javascript
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import abcjs from 'abcjs';

function SheetMusicModal({ open, onClose, abcNotation, tuneName }) {
  const notationRef = useRef(null);

  useEffect(() => {
    if (open && notationRef.current && abcNotation) {
      abcjs.renderAbc(notationRef.current, abcNotation, {
        responsive: 'resize',
        staffwidth: 800,
        scale: 1.2,
        add_classes: true,
        paddingbottom: 10,
        paddingleft: 10,
        paddingright: 10,
        paddingtop: 10
      });
    }
  }, [open, abcNotation]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" mb={2}>{tuneName}</Typography>
        <div ref={notationRef} />
      </Box>
    </Modal>
  );
}
```

### abcjs Configuration Options
```javascript
const abcOptions = {
  // Visual
  responsive: 'resize',     // Resize with container
  staffwidth: 600,          // Width in pixels
  scale: 1.0,               // Overall scale
  add_classes: true,        // Add CSS classes

  // Layout
  paddingleft: 10,
  paddingright: 10,
  paddingtop: 10,
  paddingbottom: 10,

  // Interactive
  clickListener: (abcElem, tuneNumber, classes) => {
    console.log('Clicked:', abcElem);
  },

  // Performance
  format: {
    titlefont: 'serif 20',
    gchordfont: 'serif 12'
  }
};

abcjs.renderAbc(container, abcString, abcOptions);
```

## ABC Format Components

### Required Headers
- **X:** - Reference number
- **T:** - Title
- **K:** - Key signature (must be last header)

### Common Headers
- **R:** - Rhythm (jig, reel, hornpipe, etc.)
- **M:** - Meter (6/8, 4/4, 9/8, etc.)
- **L:** - Default note length
- **C:** - Composer
- **O:** - Origin
- **S:** - Source

### Note Notation
```abc
C D E F G A B c    % Notes (C-B lowercase = middle octave, c = high C)
C, D, E, F,        % Octave below (comma)
c' d' e'           % Octave above (apostrophe)
C2 D2 E2           % Double length
C/2 D/2            % Half length
z                  % Rest
```

### Bars and Repeats
```abc
|                  % Bar line
||                 % Double bar
|:                 % Start repeat
:|                 % End repeat
|1                 % First ending
|2                 % Second ending
```

## Music Theory

### Irish Tune Types
- **Jig** (6/8): Light, bouncy
- **Slip Jig** (9/8): Graceful, flowing
- **Reel** (4/4): Fast, driving
- **Hornpipe** (4/4): Syncopated, swung
- **Polka** (2/4): Quick, staccato

### Common Keys
- **D Major**: Most common
- **G Major**: Second most common
- **E Minor** (Dorian): Common minor
- **A Dorian**: Popular mode

## Best Practices

✅ **Do:**
- Validate ABC format before rendering
- Handle rendering errors gracefully
- Use useEffect for rendering
- Clean up on component unmount
- Make responsive with resize option

❌ **Don't:**
- Render on every component render
- Ignore ABC format errors
- Forget to handle missing ABC data
- Hardcode dimensions (use responsive)
- Skip error boundaries

## Validation Function
```javascript
function isValidABC(abc) {
  if (!abc || typeof abc !== 'string') return false;

  // Must have reference number
  if (!abc.includes('X:')) return false;

  // Must have key signature
  if (!abc.includes('K:')) return false;

  // Basic structure check
  const lines = abc.split('\n');
  return lines.length > 2;
}

// Usage
if (isValidABC(tune.abc)) {
  abcjs.renderAbc(ref.current, tune.abc);
} else {
  console.error('Invalid ABC notation');
}
```

## Common Issues

**Issue:** Notation not displaying
**Solution:** Check ABC format validity, ensure ref is attached, verify abcjs loaded

**Issue:** Notation too small/large
**Solution:** Adjust `scale` and `staffwidth` options

**Issue:** Not responsive
**Solution:** Use `responsive: 'resize'` option

**Issue:** Multiple tunes rendering on same element
**Solution:** Clear container before rendering: `container.innerHTML = ''`

## Project Usage

From `src/components/TheSessionTuneDetailsPage/`:
- **TuneSetting.jsx**: Displays ABC for each tune version
- **SheetMusicModal.jsx**: Full-screen sheet music view
- **TuneSettingsList.jsx**: Lists multiple ABC settings

ABC data stored in `data/session_tunes_data.csv` in `abc` column.
