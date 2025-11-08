# Audio Player Testing Guide

## Manual Testing Checklist

### 1. Component Rendering & Initialization

- [ ] Component renders with "Activate Audio" button
- [ ] Button is enabled when visualObj prop is provided
- [ ] Button is disabled when visualObj is missing
- [ ] Loading spinner shows while loading soundfonts
- [ ] Loading completes within 2-3 seconds

### 2. Play/Pause Functionality

- [ ] Play button shows play icon initially
- [ ] Click play button → playback starts
- [ ] Play icon changes to pause icon during playback
- [ ] Click pause button → playback stops
- [ ] Resume from current position on next play (not from start)
- [ ] Progress bar updates during playback
- [ ] Play button has 48x48px size with orange gradient
- [ ] Play button has hover effect (scale and shadow)

### 3. Restart Button

- [ ] Restart button visible after audio activation
- [ ] Click restart → playback stops
- [ ] Click restart → progress resets to 0
- [ ] Current time displays 0:00.00 after restart
- [ ] Can click play immediately after restart
- [ ] Button is 32x32px with proper styling

### 4. Loop Toggle Button

- [ ] Loop button visible after audio activation
- [ ] Button shows inactive state initially (light gray)
- [ ] Click loop → button becomes orange/highlighted
- [ ] During loop: playback repeats when reaching end
- [ ] Click loop again → button returns to inactive state
- [ ] After loop disabled: playback stops at end

### 5. Progress Bar

- [ ] Progress bar visible and responsive
- [ ] Progress bar width fills available space
- [ ] Progress indicator (orange) updates during playback
- [ ] Progress moves smoothly (60fps)
- [ ] Hover over progress bar → handle appears
- [ ] Handle is round, white with orange border
- [ ] Click progress bar when paused → seek to position
- [ ] Time display updates when seeking
- [ ] Seeking during playback not allowed (or queued)

### 6. Time Display

- [ ] Time display format: MM:SS.ms (e.g., 0:12.45)
- [ ] Current time shown before forward slash
- [ ] Total duration shown after forward slash
- [ ] Updates during playback
- [ ] Updates after seeking

### 7. Tempo Control (Row 2)

- [ ] Tempo section in separate row with dark background
- [ ] "TEMPO" label visible (uppercase, small font)
- [ ] Slider shows current tempo percentage
- [ ] Valid range: 50-200%
- [ ] Slider updates in real-time
- [ ] Value label shows current percentage (e.g., "100%")
- [ ] Changing tempo affects playback speed immediately
- [ ] 100% is normal speed
- [ ] 50% is half speed
- [ ] 200% is double speed
- [ ] Tempo slider has orange thumb

### 8. Download Functionality

- [ ] "Download MIDI" button visible
- [ ] "Download WAV" button visible
- [ ] Click Download MIDI → browser downloads .midi file
- [ ] MIDI file named correctly (tune-{settingId}.midi)
- [ ] MIDI file is valid and playable
- [ ] Click Download WAV → browser downloads .wav file
- [ ] WAV file named correctly (tune-{settingId}.wav)
- [ ] WAV file contains rendered audio

### 9. Sheet Music Integration

- [ ] Sheet music renders in separate container
- [ ] Container ID matches pattern: paper-{settingId}
- [ ] During playback: cursor line appears on sheet
- [ ] Cursor line is orange (#FF6B35)
- [ ] Cursor moves with playback progress
- [ ] Notes highlight in orange as they play
- [ ] Highlights update smoothly during playback
- [ ] When playback ends: cursor disappears
- [ ] When playback ends: highlights removed

### 10. Note Clicking

- [ ] Can click individual notes on sheet music
- [ ] Single note plays when clicked
- [ ] Note plays even if main playback not started
- [ ] Sound quality matches main playback
- [ ] Multiple notes can be clicked in sequence

### 11. Responsive Design

- [ ] Layout looks good on desktop (>1024px)
- [ ] Layout looks good on tablet (768-1024px)
- [ ] Layout looks good on mobile (<768px)
- [ ] Buttons don't overlap on small screens
- [ ] Progress bar remains visible and usable on mobile
- [ ] Tempo slider usable on mobile
- [ ] Play button large enough for touch (48x48px)
- [ ] No horizontal scrolling needed

### 12. Accessibility

- [ ] All buttons have proper focus indicators
- [ ] Keyboard navigation works (Tab through controls)
- [ ] Focus visible state clearly indicated (orange outline)
- [ ] Screen reader can identify button purposes
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion settings respected (no animations if enabled)

### 13. Edge Cases & Error Handling

- [ ] Missing visualObj → component handles gracefully
- [ ] AudioContext unavailable → error message shown
- [ ] Soundfonts fail to load → error message shown
- [ ] Corrupted ABC notation → abcjs handles gracefully
- [ ] Very long tune (>10 minutes) → renders and plays correctly
- [ ] Very short tune (<5 seconds) → renders and plays correctly
- [ ] Network slowness → loading spinner shown, no freezing
- [ ] Rapid button clicks → no double playback

### 14. Browser Compatibility

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Safari on iOS
- [ ] Chrome on Android

### 15. Performance

- [ ] Audio activation completes within 2-3 seconds
- [ ] Play/pause response time <50ms
- [ ] Slider drag is smooth (60fps)
- [ ] No UI freezing during playback
- [ ] No memory leaks on page unmount
- [ ] No excessive CPU usage during playback
- [ ] Mobile performance is acceptable

### 16. Visual Consistency

- [ ] Orange gradient matches theme (#FF6B35, #FF8855)
- [ ] Dark backgrounds match theme (#141419, #0A0A0F)
- [ ] Text colors match theme (white, semi-transparent white)
- [ ] Border colors consistent (rgba(255,255,255,0.08))
- [ ] Button hover states working properly
- [ ] Focus states clearly visible
- [ ] Disabled state appears visually disabled

## Automated Test Examples

### Setup
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TuneAudioPlayerCustom from '../components/TuneAudioPlayerCustom';
import abcjs from 'abcjs';

// Mock visualObj
const mockVisualObj = {
  millisecondsPerMeasure: jest.fn(() => 500),
  getElementFromChar: jest.fn((index) => ({
    midiPitches: [60],
    midiGraceNotePitches: [],
  })),
};
```

### Test: Component Renders
```javascript
test('renders Activate Audio button initially', () => {
  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  const button = screen.getByRole('button', { name: /Activate Audio/i });
  expect(button).toBeInTheDocument();
  expect(button).toBeEnabled();
});
```

### Test: Play/Pause
```javascript
test('toggles play/pause state', async () => {
  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  // Activate audio first
  const activateBtn = screen.getByRole('button', { name: /Activate Audio/i });
  fireEvent.click(activateBtn);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  // Play/Pause toggle
  const playBtn = screen.getByRole('button', { name: /pause/i });
  fireEvent.click(playBtn);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});
```

### Test: Tempo Control
```javascript
test('adjusts tempo correctly', async () => {
  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  // Activate audio
  fireEvent.click(screen.getByRole('button', { name: /Activate Audio/i }));

  await waitFor(() => {
    const tempoSlider = screen.getByRole('slider', { name: /tempo/i });
    expect(tempoSlider).toBeInTheDocument();
  });

  const tempoSlider = screen.getByRole('slider', { name: /tempo/i });
  fireEvent.change(tempoSlider, { target: { value: '150' } });

  expect(tempoSlider).toHaveValue(150);
});
```

### Test: Download Buttons
```javascript
test('download buttons are available after activation', async () => {
  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /Activate Audio/i }));

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Download MIDI/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Download WAV/i })).toBeEnabled();
  });
});
```

## Visual Testing

### Screenshots to Compare
- Play button (inactive, hover, active)
- Progress bar (inactive, playing, hover)
- Tempo control slider
- Transport control group
- Full player layout on desktop
- Full player layout on tablet
- Full player layout on mobile

### Visual Regression Testing
Use tools like Percy or Chromatic:
```bash
npm run test:visual
```

## Integration Testing

### With Sheet Music
```javascript
test('highlights notes during playback', async () => {
  // Render sheet music in test DOM
  const container = document.createElement('div');
  container.id = 'paper-test-1';
  document.body.appendChild(container);

  // Create SVG elements to simulate notes
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  container.appendChild(svg);

  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  // Verify highlighting occurs during playback
  // (Implementation depends on your testing setup)
});
```

## Performance Testing

### Memory Leaks
```javascript
test('no memory leaks on unmount', async () => {
  const { unmount } = render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  // Activate and play
  fireEvent.click(screen.getByRole('button', { name: /Activate Audio/i }));

  // Unmount should clean up all refs
  unmount();

  // Verify no animation frames pending
  expect(requestAnimationFrame).not.toHaveBeenCalled();
});
```

### Load Time
```javascript
test('loads soundfonts within acceptable time', async () => {
  const start = performance.now();

  render(
    <TuneAudioPlayerCustom
      visualObj={mockVisualObj}
      settingId="test-1"
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /Activate Audio/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Loading Audio/i)).not.toBeInTheDocument();
  });

  const end = performance.now();
  const loadTime = end - start;

  expect(loadTime).toBeLessThan(3000); // 3 seconds max
});
```

## Troubleshooting During Testing

### Issue: Audio Context Not Available
**Solution**: Mock Web Audio API in test setup
```javascript
// In jest.setup.js
window.AudioContext = jest.fn();
window.webkitAudioContext = jest.fn();
```

### Issue: Progress Bar Not Updating
**Solution**: Ensure requestAnimationFrame is running
```javascript
jest.useFakeTimers();
// ... test code ...
jest.runAllTimers();
jest.useRealTimers();
```

### Issue: Sheet Music Not Found
**Solution**: Create container element before rendering
```javascript
const container = document.createElement('div');
container.id = `paper-${settingId}`;
document.body.appendChild(container);
```

### Issue: Download Not Triggering
**Solution**: Mock blob/URL.createObjectURL
```javascript
URL.createObjectURL = jest.fn(() => 'blob:mock');
URL.revokeObjectURL = jest.fn();
```

## Test Coverage Goals

- Component Rendering: 100%
- Play/Pause Logic: 100%
- Tempo Control: 100%
- Progress Bar: 95%
- Download: 90%
- Sheet Music Integration: 85%
- Edge Cases: 80%
- Accessibility: 90%

## Continuous Integration

Add to your CI pipeline:
```yaml
# .github/workflows/test.yml
- name: Run Unit Tests
  run: npm test -- --coverage

- name: Run Visual Tests
  run: npm run test:visual

- name: Check Accessibility
  run: npm run test:a11y

- name: Check Performance
  run: npm run test:performance
```

## Real Device Testing

### Mobile Testing
- [ ] Test on actual iPhone (Safari)
- [ ] Test on actual Android (Chrome)
- [ ] Test with 4G network throttling
- [ ] Test with touch interactions
- [ ] Test in portrait and landscape

### Touch Interactions
- [ ] Play button tappable on mobile
- [ ] Progress bar draggable on mobile
- [ ] Tempo slider draggable on mobile
- [ ] No false "double tap" issues
- [ ] Handle visibility appropriate for touch

## Regression Testing

After each update:
1. Run full test suite
2. Take visual screenshots
3. Compare with baseline
4. Test on real devices
5. Check performance metrics
6. Verify accessibility compliance

## Sign-Off Checklist

Before considering testing complete:
- [ ] All manual tests passed
- [ ] All automated tests passing
- [ ] Visual regression tests passing
- [ ] Accessibility audit passing
- [ ] Performance metrics acceptable
- [ ] Cross-browser compatibility verified
- [ ] Mobile testing completed
- [ ] No console errors or warnings
- [ ] Documentation updated
- [ ] Code reviewed and approved
