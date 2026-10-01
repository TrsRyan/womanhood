import { pictureSizes } from '../components/Picture/pictureSizes.js'
import { HOME_LEAD_PICTURE, loadArchive } from '../pages.js'
import { whenIdle } from '../animation/idle.js'

// Preloads the photo through the same AVIF candidates and sizes as its
// <picture>, so the browser picks, and caches, the very file the page will
// ask for. A browser without AVIF ignores a preload of that type.
function preloadPicture({ image, sizes, frameRatio, scale }) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.type = 'image/avif'
  link.imageSrcset = image.sources.avif
  link.imageSizes = pictureSizes(image, sizes, frameRatio, scale)
  document.head.append(link)
}

// What each page needs first, fetched before the visitor gets there: so
// the curtain, which waits for the next page to be ready, waits less.
const PAGE_PREFETCHES = {
  '/': () => preloadPicture(HOME_LEAD_PICTURE),
  '/archive': loadArchive,
}

const prefetched = new Set()

function prefetchPage(pathname) {
  const prefetch = PAGE_PREFETCHES[pathname]
  if (!prefetch || pathname === window.location.pathname || prefetched.has(pathname)) return

  prefetched.add(pathname)
  // A failed download (offline) is retried on the next hover.
  Promise.resolve(prefetch()).catch(() => prefetched.delete(pathname))
}

// After the visit has started (it must not compete with the first load):
// a link's page is prefetched as soon as the pointer is over it or it is
// focused, a little before the click; and the archive, the one other
// page, is fetched anyway once the browser is idle.
export function startPrefetching() {
  const onIntent = (event) => {
    const link = event.target.closest?.('a[href]')
    if (link && link.origin === window.location.origin) prefetchPage(link.pathname)
  }

  document.addEventListener('pointerover', onIntent, { passive: true })
  document.addEventListener('focusin', onIntent)

  whenIdle(() => prefetchPage('/archive'), 2000)
}
