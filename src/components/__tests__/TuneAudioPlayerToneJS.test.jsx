import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ============================================================================
// POLYFILLS
// ============================================================================

// Polyfill for Blob.arrayBuffer() in JSDOM environment
if (!Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function () {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsArrayBuffer(this);
    });
  };
}

// ============================================================================
// MOCK SETUP
// ============================================================================

// Enable manual mocks
jest.mock('tone');
jest.mock('@tonejs/midi');

// Mock abcjs
jest.mock('abcjs', () => ({
  synth: {
    getMidiFile: jest.fn(() => new Uint8Array([77, 84, 104, 100])),
  },
}));

// Import after mocks are set up
import TuneAudioPlayerToneJS from '../TuneAudioPlayerToneJS';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import abcjs from 'abcjs';

// ============================================================================
// TEST FIXTURES
// ============================================================================

const createMockVisualObj = (abcText = 'X:1\nT:Test Tune\nM:4/4\nK:C\nCDEF|') => [
  {
    abc: abcText,
    lines: [],
    staffs: [],
  },
];

const mockVisualObjWithPickup = [
  {
    abc: 'X:1\nT:Test with Pickup\nM:4/4\nK:C\nL:1/8\n|:AB|c4 d4|',
    lines: [],
    staffs: [],
  },
];

const mockVisualObjInvalid = [
  {
    abc: null,
    lines: [],
    staffs: [],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const resetAllMocks = () => {
  // Don't use jest.clearAllMocks() - it breaks the tone.js mock tracking
  // Instead, manually clear only what we need

  // Clear specific Tone mock call histories
  const mocks = Tone.__mocks;
  mocks.mockTriggerAttackRelease.mockClear();
  mocks.mockSynthDispose.mockClear();
  mocks.mockPartDispose.mockClear();
  mocks.mockPartStart.mockClear();
  mocks.mockTransportStart.mockClear();
  mocks.mockTransportPause.mockClear();
  mocks.mockTransportStop.mockClear();
  mocks.mockTransportCancel.mockClear();
  mocks.mockTransportClear.mockClear();
  mocks.mockTransportScheduleRepeat.mockClear();
  // Restore scheduleRepeat's return value after clearing
  mocks.mockTransportScheduleRepeat.mockReturnValue(1);

  // Reset Tone.js state
  Tone.start.mockClear();
  Tone.start.mockResolvedValue(undefined);
  Tone.context.state = 'running';
  Tone.Transport.seconds = 0;
  Tone.Transport.state = 'stopped';

  // Reset context methods with their implementations
  Tone.context.createBuffer.mockClear();
  Tone.context.createBuffer.mockReturnValue({});
  Tone.context.createBufferSource.mockClear();
  Tone.context.createBufferSource.mockReturnValue({
    buffer: null,
    connect: jest.fn(),
    start: jest.fn(),
  });

  // Reset MIDI mock
  Midi.mockClear();
  Midi.mockImplementation(() => require('@tonejs/midi').__mockMidiData);

  // Reset abcjs mock
  abcjs.synth.getMidiFile.mockClear();
  abcjs.synth.getMidiFile.mockReturnValue(new Uint8Array([77, 84, 104, 100]));
};

const activateAudioPlayer = async () => {
  // Find and click the button (it should be enabled after useEffect runs)
  const button = await screen.findByRole('button', { name: /activate audio/i });

  // Wait a bit for useEffect to extract ABC text
  await waitFor(() => {
    expect(button).not.toBeDisabled();
  });

  // Click the now-enabled button
  fireEvent.click(button);

  // Wait for the slider to appear, which indicates the player is ready
  await waitFor(() => {
    expect(screen.getByRole('slider')).toBeInTheDocument();
  }, { timeout: 3000 });
};

// ============================================================================
// TEST SUITES
// ============================================================================

describe('TuneAudioPlayerToneJS', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    // Don't clear all mocks - let resetAllMocks handle it in beforeEach
    // jest.clearAllMocks();
  });

  // ==========================================================================
  // INITIALIZATION & RENDERING
  // ==========================================================================

  describe('Initialization & Rendering', () => {
    test('renders activation button when not ready', () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-001"
        />
      );

      expect(screen.getByRole('button', { name: /activate audio/i })).toBeInTheDocument();
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    test('disables activation button when no ABC text available', () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={mockVisualObjInvalid}
          settingId="test-002"
        />
      );

      const button = screen.getByRole('button', { name: /activate audio/i });
      expect(button).toBeDisabled();
    });

    test('shows loading state during initialization', async () => {
      Tone.start.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-003"
        />
      );

      const button = screen.getByRole('button', { name: /activate audio/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/loading audio/i)).toBeInTheDocument();
      });
    });

    test('renders player UI after successful activation', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-004"
        />
      );

      await activateAudioPlayer();

      expect(screen.getByRole('slider')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // PLAY/PAUSE/RESTART STATE TRANSITIONS (Requirement 1)
  // ==========================================================================

  describe('Play/Pause/Restart State Transitions', () => {
    test('transitions from STOPPED to PLAYING when play button clicked', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-010"
        />
      );

      await activateAudioPlayer();

      const playButton = screen.getByLabelText(/play/i);
      fireEvent.click(playButton);

      expect(Tone.Transport.start).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
      });
    });

    test('transitions from PLAYING to PAUSED when pause button clicked', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-011"
        />
      );

      await activateAudioPlayer();

      // Start playing
      const playButton = screen.getByLabelText(/play/i);
      fireEvent.click(playButton);

      // Pause
      await waitFor(() => {
        const pauseButton = screen.getByLabelText(/pause/i);
        fireEvent.click(pauseButton);
      });

      expect(Tone.Transport.pause).toHaveBeenCalledTimes(1);
    });

    test('resumes from PAUSED to PLAYING when play clicked', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-012"
        />
      );

      await activateAudioPlayer();

      // Play → Pause → Play
      const playButton = screen.getByLabelText(/play/i);
      fireEvent.click(playButton);

      await waitFor(() => {
        const pauseButton = screen.getByLabelText(/pause/i);
        fireEvent.click(pauseButton);
      });

      await waitFor(() => {
        const resumeButton = screen.getByLabelText(/play/i);
        fireEvent.click(resumeButton);
      });

      expect(Tone.Transport.start).toHaveBeenCalledTimes(2);
    });

    test('restart button stops playback and resets to 0', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-013"
        />
      );

      await activateAudioPlayer();

      // Start playing
      fireEvent.click(screen.getByLabelText(/play/i));

      // Simulate time progression
      Tone.Transport.seconds = 5;

      // Restart
      const restartButton = screen.getByLabelText(/restart/i);
      fireEvent.click(restartButton);

      expect(Tone.Transport.stop).toHaveBeenCalled();
      expect(Tone.Transport.seconds).toBe(0);
    });

    test('prevents invalid state transitions', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-014"
        />
      );

      await activateAudioPlayer();

      const initialCallCount = Tone.Transport.pause.mock.calls.length;

      // Component is in STOPPED state, clicking play should only start
      fireEvent.click(screen.getByLabelText(/play/i));

      expect(Tone.Transport.start).toHaveBeenCalled();
      expect(Tone.Transport.pause).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  // ==========================================================================
  // SEEK FUNCTIONALITY WITHOUT TRANSPORT.CANCEL (Requirement 2)
  // ==========================================================================

  describe('Seek Functionality', () => {
    test('seeks to new position without calling Transport.cancel()', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-020"
        />
      );

      await activateAudioPlayer();

      const slider = screen.getByRole('slider');

      // Seek to 1.5 seconds
      fireEvent.change(slider, { target: { value: 1.5 } });

      expect(Tone.Transport.seconds).toBe(1.5);
      expect(Tone.Transport.cancel).not.toHaveBeenCalled();
    });

    test('pauses during seek if playing, then resumes', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-021"
        />
      );

      await activateAudioPlayer();

      // Start playing
      fireEvent.click(screen.getByLabelText(/play/i));
      const initialPauseCount = Tone.Transport.pause.mock.calls.length;
      const initialStartCount = Tone.Transport.start.mock.calls.length;

      // Seek while playing
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: 1.0 } });

      expect(Tone.Transport.pause.mock.calls.length).toBeGreaterThan(initialPauseCount);
      expect(Tone.Transport.start.mock.calls.length).toBeGreaterThan(initialStartCount);
    });

    test('seeks without resuming if paused', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-022"
        />
      );

      await activateAudioPlayer();

      // Don't start playing, just seek
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: 1.0 } });

      expect(Tone.Transport.seconds).toBe(1.0);
      expect(Tone.Transport.start).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // iOS GESTURE UNLOCK SIMULATION (Requirement 3)
  // ==========================================================================

  describe('iOS Audio Unlock', () => {
    test('performs iOS audio unlock when context not running', async () => {
      Tone.context.state = 'suspended';

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-030"
        />
      );

      await activateAudioPlayer();

      expect(Tone.context.createBuffer).toHaveBeenCalledWith(1, 1, 22050);
      expect(Tone.context.createBufferSource).toHaveBeenCalled();
    });

    test('skips iOS unlock when context already running', async () => {
      Tone.context.state = 'running';

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-031"
        />
      );

      // Reset mocks before activation
      Tone.context.createBuffer.mockClear();
      Tone.context.createBufferSource.mockClear();

      await activateAudioPlayer();

      // Should not attempt iOS unlock
      expect(Tone.context.createBuffer).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // MEMORY LEAK PREVENTION (Requirement 4)
  // ==========================================================================

  describe('Memory Leak Prevention', () => {
    test('100 play/stop cycles without memory leaks', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-040"
        />
      );

      await activateAudioPlayer();

      const mocks = Tone.__mocks;

      // Simulate 100 play/stop cycles
      for (let i = 0; i < 100; i++) {
        fireEvent.click(screen.getByLabelText(/play/i));
        await waitFor(() => {
          expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByLabelText(/pause/i));
        await waitFor(() => {
          expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
        });
      }

      // Verify disposal not called during cycles
      expect(mocks.mockSynthDispose).not.toHaveBeenCalled();
      expect(mocks.mockPartDispose).not.toHaveBeenCalled();

      // Unmount and verify cleanup
      unmount();

      expect(Tone.Transport.stop).toHaveBeenCalled();
      expect(Tone.Transport.cancel).toHaveBeenCalled();
      expect(Tone.Transport.clear).toHaveBeenCalled();
      expect(mocks.mockPartDispose).toHaveBeenCalled();
      expect(mocks.mockSynthDispose).toHaveBeenCalled();
    });

    test('disposes resources on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-041"
        />
      );

      await activateAudioPlayer();

      const mocks = Tone.__mocks;

      unmount();

      expect(Tone.Transport.stop).toHaveBeenCalled();
      expect(Tone.Transport.cancel).toHaveBeenCalled();
      expect(mocks.mockPartDispose).toHaveBeenCalled();
      expect(mocks.mockSynthDispose).toHaveBeenCalled();
    });

    test('clears scheduled progress updates on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-042"
        />
      );

      await activateAudioPlayer();

      expect(Tone.Transport.scheduleRepeat).toHaveBeenCalled();

      unmount();

      expect(Tone.Transport.clear).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // ERROR HANDLING (Requirement 5)
  // ==========================================================================

  describe('Error Handling', () => {
    test('handles missing ABC text gracefully', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={mockVisualObjInvalid}
          settingId="test-050"
        />
      );

      const button = screen.getByRole('button', { name: /activate audio/i });
      expect(button).toBeDisabled();
    });

    test('displays error message when MIDI generation fails', async () => {
      abcjs.synth.getMidiFile.mockImplementation(() => {
        throw new Error('Failed to generate MIDI');
      });

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-051"
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /activate audio/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to initialize audio/i)).toBeInTheDocument();
      });
    });

    test('handles Tone.start() failure', async () => {
      Tone.start.mockRejectedValue(new Error('AudioContext failed'));

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-052"
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /activate audio/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to initialize audio/i)).toBeInTheDocument();
      });
    });

    test('handles MIDI parsing errors', async () => {
      Midi.mockImplementation(() => {
        throw new Error('Invalid MIDI data');
      });

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-053"
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /activate audio/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to initialize audio/i)).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // DURATION CALCULATION WITH PICKUP BARS (Requirement 6)
  // ==========================================================================

  describe('Duration Calculation', () => {
    test('calculates duration from note data, not MIDI header', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-060"
        />
      );

      await activateAudioPlayer();

      // Last note: time=1.0, duration=1.0, end=2.0 + 0.5 buffer = 2.5
      await waitFor(() => {
        expect(screen.getByText(/2\.50/)).toBeInTheDocument();
      });
    });

    test('adds reverb tail buffer to duration', async () => {
      const mockMidiWithLongNote = {
        header: { bpm: 120 },
        tracks: [
          {
            notes: [
              { time: 0, name: 'C4', duration: 3.0, velocity: 0.8 },
            ],
          },
        ],
      };

      Midi.mockReturnValue(mockMidiWithLongNote);

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-061"
        />
      );

      await activateAudioPlayer();

      // Note ends at 3.0, buffer adds 0.5 = 3.5 total
      await waitFor(() => {
        expect(screen.getByText(/3\.50/)).toBeInTheDocument();
      });
    });

    test('handles pickup bars correctly in duration', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={mockVisualObjWithPickup}
          settingId="test-062"
        />
      );

      await activateAudioPlayer();

      // Should calculate correctly regardless of pickup
      await waitFor(() => {
        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('max');
        expect(parseFloat(slider.getAttribute('max'))).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================================================
  // CLEANUP/DISPOSAL ON UNMOUNT (Requirement 7)
  // ==========================================================================

  describe('Cleanup on Unmount', () => {
    test('stops Transport on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-070"
        />
      );

      await activateAudioPlayer();

      unmount();

      expect(Tone.Transport.stop).toHaveBeenCalled();
      expect(Tone.Transport.cancel).toHaveBeenCalled();
    });

    test('disposes Part on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-071"
        />
      );

      await activateAudioPlayer();

      const mocks = Tone.__mocks;

      unmount();

      expect(mocks.mockPartDispose).toHaveBeenCalled();
    });

    test('disposes Synth on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-072"
        />
      );

      await activateAudioPlayer();

      const mocks = Tone.__mocks;

      unmount();

      expect(mocks.mockSynthDispose).toHaveBeenCalled();
    });

    test('clears progress tracker on unmount', async () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-073"
        />
      );

      await activateAudioPlayer();

      unmount();

      expect(Tone.Transport.clear).toHaveBeenCalled();
    });

    test('does not throw errors on unmount before activation', () => {
      const { unmount } = render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-074"
        />
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  // ==========================================================================
  // INTEGRATION & UI BEHAVIOR
  // ==========================================================================

  describe('Integration & UI Behavior', () => {
    test('displays formatted time correctly', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-080"
        />
      );

      await activateAudioPlayer();

      // Time format: MM:SS.ms
      await waitFor(() => {
        expect(screen.getByText(/0:00\.00/)).toBeInTheDocument();
      });
    });

    test('slider range matches calculated duration', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-081"
        />
      );

      await activateAudioPlayer();

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('max', '2.5');
    });

    test('play button shows pause icon when playing', async () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-082"
        />
      );

      await activateAudioPlayer();

      fireEvent.click(screen.getByLabelText(/play/i));

      await waitFor(() => {
        expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
      });
    });

    test('disables controls before activation', () => {
      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-083"
        />
      );

      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });
  });

  // ==========================================================================
  // EDGE CASES
  // ==========================================================================

  describe('Edge Cases', () => {
    test('handles empty MIDI tracks gracefully', async () => {
      const emptyMidi = {
        header: { bpm: 120 },
        tracks: [],
      };

      Midi.mockReturnValue(emptyMidi);

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-090"
        />
      );

      await activateAudioPlayer();

      // Should set duration to 0.5 (buffer only)
      await waitFor(() => {
        expect(screen.getByRole('slider')).toHaveAttribute('max', '0.5');
      });
    });

    test('handles single note correctly', async () => {
      const singleNoteMidi = {
        header: { bpm: 120 },
        tracks: [
          {
            notes: [
              { time: 0, name: 'C4', duration: 1.0, velocity: 0.8 },
            ],
          },
        ],
      };

      Midi.mockReturnValue(singleNoteMidi);

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-091"
        />
      );

      await activateAudioPlayer();

      // Duration: 1.0 + 0.5 buffer = 1.5
      await waitFor(() => {
        expect(screen.getByText(/1\.50/)).toBeInTheDocument();
      });
    });

    test('handles very long duration correctly', async () => {
      const longMidi = {
        header: { bpm: 120 },
        tracks: [
          {
            notes: [
              { time: 0, name: 'C4', duration: 300, velocity: 0.8 },
            ],
          },
        ],
      };

      Midi.mockReturnValue(longMidi);

      render(
        <TuneAudioPlayerToneJS
          visualObj={createMockVisualObj()}
          settingId="test-092"
        />
      );

      await activateAudioPlayer();

      // Duration: 300 + 0.5 = 300.5 (formatted as 5:00.50)
      await waitFor(() => {
        expect(screen.getByText(/5:00\.50/)).toBeInTheDocument();
      });
    });
  });
});
