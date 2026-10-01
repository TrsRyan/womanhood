// Runs `callback` once the browser has a quiet moment between frames.
// Safari has no requestIdleCallback; a short delay stands in for it.
export function whenIdle(callback, fallbackDelay = 50) {
  if ('requestIdleCallback' in window) return window.requestIdleCallback(callback)
  return setTimeout(callback, fallbackDelay)
}
