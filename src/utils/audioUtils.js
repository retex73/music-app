/**
 * Audio Utilities for Tone.js Audio Player
 *
 * Provides audio conversion and export functions for Phase 2 features.
 * Currently includes stub implementation for WAV export.
 */

/**
 * Convert an AudioBuffer to WAV format
 *
 * Implements full PCM WAV encoder for Phase 2 WAV download feature.
 * Creates a standard 16-bit PCM WAV file from AudioBuffer.
 *
 * @param {AudioBuffer} audioBuffer - The audio buffer to convert
 * @returns {Blob} WAV file as Blob
 *
 * WAV File Format:
 * - RIFF header (12 bytes)
 * - fmt chunk (24 bytes)
 * - data chunk header (8 bytes)
 * - PCM audio data (interleaved channels)
 */
export function audioBufferToWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  // Get audio data from all channels
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  const length = channels[0].length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize; // 44 byte header + data

  // Create ArrayBuffer for WAV file
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Helper function to write string
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true); // File size - 8
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // Audio format (1 = PCM)
  view.setUint16(22, numChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, byteRate, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitDepth, true); // Bits per sample

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      // Convert float32 (-1 to 1) to int16 (-32768 to 32767)
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Download WAV Blob as file
 *
 * Helper function for Phase 2 WAV download feature.
 *
 * @param {Blob} wavBlob - The WAV blob to download
 * @param {string} filename - The filename for the download
 */
export function downloadWav(wavBlob, filename = 'audio.wav') {
  const url = URL.createObjectURL(wavBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup after download (Safari/Firefox robustness)
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
}
