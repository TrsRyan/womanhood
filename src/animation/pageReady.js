import { whenFontsLoaded } from './fonts.js'

// Default longest wait (ms) before showing a page anyway.
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

// Settles once the image has finished downloading, or failed to.
const whenDownloaded = (image) =>
  image.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      })

// Resolves once the page on screen can be revealed without a hitch: the
// fonts are in (so the text reveals have split their text), every image
// on screen is downloaded and decoded (so drawing it doesn't stall the
// first frames of the reveal), and the browser has painted the result
// twice. Call it once the page is in place and scrolled to where it will
// be shown.
// - `alsoWaitFor` adds other promises to wait for (the music on a first
//   visit).
// - `allImages` also downloads every other image of the page now, rather
//   than as it is scrolled to, so none is ever seen still loading. They
//   are only downloaded, not decoded: decoding one off screen would hold
//   its full-size bitmap in memory for nothing, and an image already
//   downloaded decodes in a moment when it comes into view.
// - `timeout` (ms) is the longest wait: a stalled photo or a dropped
//   connection must never leave the screen covered. Downloads still under
//   way carry on after it.
export async function waitForPageReady({ alsoWaitFor = [], allImages = false, timeout = READY_TIMEOUT } = {}) {
  const ready = async () => {
    const images = imagesOnScreen()
    const otherImages = allImages
      ? [...document.querySelectorAll('img')].filter((image) => !images.includes(image))
      : []

    // Lazy loading waits for the image to be laid out near the screen,
    // which a covered page may never trigger in time; these are needed now.
    for (const image of [...images, ...otherImages]) {
      if (image.loading === 'lazy') image.loading = 'eager'
    }

    await Promise.all([
      whenFontsLoaded(),
      ...images.map((image) => image.decode().catch(() => {})),
      ...otherImages.map(whenDownloaded),
      ...alsoWaitFor,
    ])
    await nextFrame()
    await nextFrame()
  }

  await Promise.race([ready(), delay(timeout)])
}
