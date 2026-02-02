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
    'audio/mp4',
  ];

  const supported = candidates.filter((t) => {
    try {
      return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t);
    } catch {
      return false;
    }
  });

  // Always include a final fallback that omits mimeType entirely.
  return [...supported, ''];
}
