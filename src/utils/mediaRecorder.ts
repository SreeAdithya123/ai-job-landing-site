export type MediaRecorderMimeType = string;

// Returns a preferred list of MIME types to try (most compatible first), filtered by `MediaRecorder.isTypeSupported`.
// Includes an empty string at the end meaning: create MediaRecorder without a mimeType (let the browser decide).
export function getSupportedMediaRecorderMimeTypes(): MediaRecorderMimeType[] {
  const candidates: MediaRecorderMimeType[] = [
    // Chrome/Edge typically support this (but some environments still throw on start)
    'audio/webm;codecs=opus',
    'audio/webm',

    // Firefox
    'audio/ogg;codecs=opus',
    'audio/ogg',

    // Safari (sometimes)
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
  ];

  // Some browsers either don't implement `isTypeSupported` or return false for everything
  // even though some mime types can still work. In those cases we should still *try* known
  // candidates before falling back to browser-default.
  const hasIsTypeSupported =
    typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function';

  if (!hasIsTypeSupported) {
    return [...candidates, ''];
  }

  const supported = candidates.filter((t) => {
    try {
      return MediaRecorder.isTypeSupported(t);
    } catch {
      return false;
    }
  });

  // If the browser claims nothing is supported, still try the known candidates.
  if (supported.length === 0) {
    return [...candidates, ''];
  }

  // Always include a final fallback that omits mimeType entirely.
  return [...supported, ''];
}
