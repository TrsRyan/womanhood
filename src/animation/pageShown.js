// Where the page on screen stands as the curtain opens on it
// (PageTransition). Neither applies on a full page load, under the enter
// screen, nor from the moment the curtain starts closing for a page change.
// - Arriving: the curtain is about to finish opening. Animations of what
//   is on screen at arrival wait for this: seen in full rather than played
//   behind the curtain, and already under way as it clears.
// - Shown: the curtain has finished opening. Deferred work (splitting
//   texts ahead of time) waits for this, so it never lands on the frames
//   of a curtain move.
const deferred = () => {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

let arriving = deferred()
let shown = deferred()
let isShown = false

export function whenPageArriving() {
  return arriving.promise
}

export function whenPageShown() {
  return shown.promise
}

export function isPageShown() {
  return isShown
}

// The curtain is about to finish opening.
export function markPageArriving() {
  arriving.resolve()
}

// The curtain has finished opening.
export function markPageShown() {
  isShown = true
  arriving.resolve()
  shown.resolve()
}

// The curtain starts closing.
export function markPageHidden() {
  if (!isShown) return
  isShown = false
  arriving = deferred()
  shown = deferred()
}
