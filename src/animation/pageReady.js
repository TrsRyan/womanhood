import { whenFontsLoaded } from './fonts.js'

// Longest wait before showing a page anyway: a stalled photo or a dropped
// connection must never leave the screen covered.
const READY_TIMEOUT = 4000

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Images that will be on screen once the cover lifts. An image animated
// from scale 0 has no area yet and is left out, like everything below
// the fold.
function imagesOnScreen() {
  return [...document.querySelectorAll('img')].filter((image) => {
    const box = image.getBoundingClientRect()
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < window.innerHeight
  })
}

// Resolves once the page on screen can be revealed without a hitch: the
// fonts are in (so the text reveals have split their text), every image
// on screen is downloaded and decoded (so drawing it doesn't stall the
// first frames of the reveal), and the browser has painted the result
// twice. Call it once the page is in place and scrolled to where it will
// be shown. `alsoWaitFor` adds other promises to wait for (the music on a
// first visit). Never waits longer than READY_TIMEOUT.
export async function waitForPageReady({ alsoWaitFor = [] } = {}) {
  const ready = async () => {
    const images = imagesOnScreen()

    // Lazy loading waits for the image to be laid out on screen, which a
    // covered page may never trigger in time; these are needed now.
    images.forEach((image) => {
      if (image.loading === 'lazy') image.loading = 'eager'
    })

    await Promise.all([
      whenFontsLoaded(),
      ...images.map((image) => image.decode().catch(() => {})),
      ...alsoWaitFor,
    ])
    await nextFrame()
    await nextFrame()
  }

  await Promise.race([ready(), delay(READY_TIMEOUT)])
}
