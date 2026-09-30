import { Outlet, ScrollRestoration } from 'react-router'
import SmoothScroll from './components/SmoothScroll/SmoothScroll.jsx'
import RouteChange from './components/RouteChange/RouteChange.jsx'

// Shell shared by every page: it stays mounted while the Outlet swaps
// pages, so anything here keeps running across navigations. Order
// matters: layout effects run in tree order, so the new page builds its
// ScrollTriggers, ScrollRestoration then places the scroll, and
// RouteChange measures last.
function Root() {
  return (
    <SmoothScroll>
      <Outlet />
      <ScrollRestoration />
      <RouteChange />
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
