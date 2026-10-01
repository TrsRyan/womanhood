// Whether the page is fully on screen: the curtain has finished opening
// on it. Deferred work (splitting texts ahead of time) waits for it, so it
// never lands on the frames of a curtain move.
let shown = false
let resolveShown
let shownPromise = new Promise((resolve) => {
  resolveShown = resolve
})

export function whenPageShown() {
  return shownPromise
}

export function isPageShown() {
  return shown
}

// The curtain has finished opening.
export function markPageShown() {
  shown = true
  resolveShown()
}

// The curtain starts closing.
export function markPageHidden() {
  if (!shown) return
  shown = false
  shownPromise = new Promise((resolve) => {
    resolveShown = resolve
  })
}
