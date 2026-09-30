import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

// ScrollRestoration sets history.scrollRestoration to manual. Without
// this, every ScrollTrigger refresh would put back the value ScrollTrigger
// found at startup.
ScrollTrigger.clearScrollMemory('manual')

const PAGE_TITLES = {
  '/': 'WoManHood',
  '/archive': 'WoManHood — Archive',
}

// Pages swap without a reload, so what the page load used to do is redone
// here whenever the page changes, not on a #chapter change. Runs after
// ScrollRestoration (Root.jsx), with the scroll already in place.
function RouteChange() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  const previousPathname = useRef(pathname)

  useLayoutEffect(() => {
    document.title = PAGE_TITLES[pathname]

    if (!lenis || pathname === previousPathname.current) return
    previousPathname.current = pathname

    // The load event that measured every trigger in refreshPriority order
    // never fires again. Lenis measures after the pins have sized the page,
    // rather than up to 250ms later on its own.
    ScrollTrigger.refresh()
    lenis.resize()
  }, [pathname, lenis])

  return null
}

export default RouteChange
