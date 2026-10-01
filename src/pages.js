import images from './assets/images.js'

// Archive is split into its own file. The router loads it on a visit, and
// navigation/prefetch.js ahead of one; import() caches the module, so
// both share a single download.
export const loadArchive = () => import('./Archive.jsx')

// The photo the home page opens on, behind its title: the page fetches it
// first, and other pages preload it when a link home is hovered. `scale`
// is the largest zoom its timeline reaches (App.jsx), so the file fetched
// stays sharp at it.
export const HOME_LEAD_PICTURE = {
  image: images['transition-image'],
  sizes: 'viewport',
  scale: 1.22,
}
