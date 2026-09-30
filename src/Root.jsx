import SmoothScroll from './components/SmoothScroll/SmoothScroll.jsx'
import PageTransition from './components/PageTransition/PageTransition.jsx'

// Shell shared by every page: it stays mounted while pages swap, so
// anything here keeps running across navigations.
function Root() {
  return (
    <SmoothScroll>
      <PageTransition />
    </SmoothScroll>
  )
}

// Rendered instead of Root on a first load while a lazily loaded page is
// still being fetched. Nothing to show yet: the page background shows
// through.
export function HydrateFallback() {
  return null
}

export default Root
