/**
 * MIDI normalization utilities for handling different abcjs versions
 *
 * Different abcjs versions and multi-version tunes can return:
 * - Blob (modern versions, single tune)
 * - Array of Blobs (multi-version tunes)
 * - ArrayBuffer or TypedArray
 * - Percent-encoded string
 * - Object wrapper with .data, .blob, .buffer, or .arrayBuffer()
 * - HTML link string (when midiOutputType not specified)
 *
 * This normalizer provides version-proof MIDI generation.
 */

import abcjs from "abcjs";

/**
 * Convert ABC notation to MIDI ArrayBuffer (version-proof, multi-version aware)
 *
 * Handles multiple abcjs version return types and multi-version tunes.
 * For multi-version ABC (multiple X: headers), abcjs may return an Array.
 * Use versionIndex to select which version to extract.
 *
 * @param {string} abcText - ABC notation text
 * @param {number} versionIndex - Index of version to extract (default: 0)
 * @returns {Promise<ArrayBuffer>} MIDI data as ArrayBuffer
 * @throws {Error} If abcText is empty or getMidiFile returns HTML/unsupported type
 *
 * @example
 * // Single version tune
 * const arrayBuffer = await abcToMidiArrayBuffer(abcText, 0);
 * const midi = new Midi(arrayBuffer);
 *
 * @example
 * // Multi-version tune (select 2nd version)
 * const arrayBuffer = await abcToMidiArrayBuffer(abcText, 1);
 */
export async function abcToMidiArrayBuffer(abcText, versionIndex = 0) {
  if (!abcText || !abcText.trim()) {
    throw new Error("ABC text is empty or invalid");
  }

  // Call abcjs with binary output type
  const out = abcjs.synth.getMidiFile(abcText, { midiOutputType: "binary" });

  // Normalize to ArrayBuffer
  return await normalizeToArrayBuffer(out, versionIndex);
}

/**
 * Recursive normalizer that handles all abcjs return types
 *
 * @param {*} out - Output from abcjs.synth.getMidiFile()
 * @param {number} idx - Version index for array outputs
 * @returns {Promise<ArrayBuffer>} Normalized MIDI data
 */
async function normalizeToArrayBuffer(out, idx) {
  // Case 1: Blob (ideal, modern abcjs)
  if (out instanceof Blob) {
    console.log("✓ abcjs returned Blob (ideal)");
    return await out.arrayBuffer();
  }

  // Case 2: ArrayBuffer (direct)
  if (out instanceof ArrayBuffer) {
    console.log("✓ abcjs returned ArrayBuffer");
    return out;
  }

  // Case 3: TypedArray (Uint8Array, etc.)
  if (ArrayBuffer.isView(out)) {
    console.log("✓ abcjs returned TypedArray");
    return out.buffer;
  }

  // Case 4: Array (multi-version tunes)
  if (Array.isArray(out)) {
    console.log(`✓ abcjs returned Array (length: ${out.length}), selecting index ${idx}`);
    if (out.length === 0) {
      throw new Error("abcjs returned an empty MIDI array");
    }
    const pick = out[idx] ?? out[0]; // Use requested index, fallback to first
    return normalizeToArrayBuffer(pick, 0); // Recursive call
  }

  // Case 5: Object wrapper (various shapes)
  if (out && typeof out === "object") {
    console.log("✓ abcjs returned object, checking properties:", Object.keys(out).slice(0, 5).join(", "));

    // Try .blob property (wrapped Blob)
    if (out.blob instanceof Blob) {
      console.log("  → Using .blob property");
      return await out.blob.arrayBuffer();
    }

    // Try .arrayBuffer() method
    if (typeof out.arrayBuffer === "function") {
      console.log("  → Using .arrayBuffer() method");
      return await out.arrayBuffer();
    }

    // Try .buffer property (ArrayBuffer)
    if (out.buffer instanceof ArrayBuffer) {
      console.log("  → Using .buffer property");
      return out.buffer;
    }

    // Try .data property (percent-encoded string)
    if (out.data && typeof out.data === "string") {
      console.log("  → Using .data property");
      return stringToBytesArrayBuffer(out.data);
    }

    // Unknown object shape
    const keys = Object.keys(out).join(", ");
    throw new Error(`Unknown object shape from abcjs. Keys: ${keys}`);
  }

  // Case 6: Percent-encoded or raw string
  if (typeof out === "string") {
    const trimmed = out.trim();

    // Check for HTML link (indicates midiOutputType was ignored)
    if (trimmed.startsWith("<")) {
      throw new Error(
        "abcjs returned an HTML link. Ensure midiOutputType:'binary' is supported or upgrade abcjs."
      );
    }

    console.log("✓ abcjs returned string, decoding...");
    return stringToBytesArrayBuffer(out);
  }

  // Unsupported type
  throw new Error(
    `Unsupported abcjs MIDI output type: ${Object.prototype.toString.call(out)}`
  );
}

/**
 * Convert percent-encoded or raw string to ArrayBuffer
 *
 * @param {string} encoded - Percent-encoded or raw byte string
 * @returns {ArrayBuffer} Decoded bytes
 */
function stringToBytesArrayBuffer(encoded) {
  // Decode if percent-encoded, otherwise use as-is
  const byteStr = encoded.includes("%") ? decodeURIComponent(encoded) : encoded;
  const u8 = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    u8[i] = byteStr.charCodeAt(i);
  }
  return u8.buffer;
}
