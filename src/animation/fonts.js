// The site's single font, as the CSS Font Loading API names it.
const SITE_FONT = '1em "Geist Variable"'

// Resolves once the site's font is downloaded and laid out. Waiting for
// document.fonts.ready alone isn't enough: it only covers fonts the page
// has already asked for, and on a first visit Geist may not be asked for
// yet, so the wait would end before the font arrives. Asking for it with
// document.fonts.load starts the download now and waits for it (CSS Font
// Loading API). A failed download resolves too: the fallback font is then
// the one measured and shown. One promise for the whole visit: callers
// waiting on it run in the order they asked, so the text splits set up on
// mount finish before the page-ready check that follows them.
let fontsLoaded

export function whenFontsLoaded() {
  fontsLoaded ??= document.fonts
    .load(SITE_FONT)
    .catch(() => {})
    .then(() => document.fonts.ready)
  return fontsLoaded
}

// Whether the font is in at this very moment.
export function isFontLoaded() {
  return document.fonts.check(SITE_FONT)
}
