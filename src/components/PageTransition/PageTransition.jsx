import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigation, useNavigationType, useOutlet } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import Curtain from '../Curtain/Curtain.jsx'
import EnterScreen from '../EnterScreen/EnterScreen.jsx'
import { waitForPageReady } from '../../animation/pageReady.js'
import { markPageArriving, markPageHidden, markPageShown } from '../../animation/pageShown.js'
import { enterSoundtrack, loadSoundtrack } from '../../audio/soundtrack.js'
import { startPrefetching } from '../../navigation/prefetch.js'

gsap.registerPlugin(ScrollTrigger)

// Scroll positions are placed here, behind the closed curtain, so the
// browser must not restore them on its own. Without this, every
// ScrollTrigger refresh would put back the value it found at startup.
ScrollTrigger.clearScrollMemory('manual')

// Seconds before the curtain is fully open at which the animations of what
// is on screen start, so they are under way as it clears.
const ARRIVAL_LEAD = 0.4

// Longest wait (ms) before Enter is offered on a full page load, however
// much is still downloading: a fast connection is ready well before, a
// very slow one still gets in.
const ENTRY_TIMEOUT = 8000

const PAGE_TITLES = {
  '/': 'WoManHood',
  '/archive': 'WoManHood — Archive',
}
const NOT_FOUND_TITLE = 'WoManHood — Page not found'

// The site's page at this address, trailing slash or not; undefined for
// one it doesn't have.
const pageTitle = (pathname) => PAGE_TITLES[pathname.replace(/(.)\/+$/, '$1')]

// Survives reloads, so Back after a reload still returns to where the
// previous page was left.
const SCROLL_STORAGE_KEY = 'womanhood-scroll-positions'

const readScrollPositions = () => {
  try {
    return new Map(JSON.parse(sessionStorage.getItem(SCROLL_STORAGE_KEY)) ?? [])
  } catch {
    return new Map()
  }
}

// Every page change, from a link or the browser's Back and Forward, runs
// the same sequence: the page on screen stays frozen while the curtain
// closes, the next page swaps in behind the black, the scroll is placed
// and measured, then the curtain opens. The URL changes first; the page
// on screen only catches up behind the curtain. A full page load starts
// with the curtain already closed, under the enter screen: it opens on
// Enter, once the page is ready. An address the site doesn't have shows
// its 404 at once instead: there is nothing there to prepare or to play.
function PageTransition() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const navigation = useNavigation()
  const outlet = useOutlet()
  const lenis = useLenis()
  const curtainRef = useRef(null)
  const enterScreenRef = useRef(null)

  const [page, setPage] = useState(() => ({ outlet, location, navigationType }))
  const [skipsEntry] = useState(() => pageTitle(location.pathname) === undefined)
  // The site loads behind the closed curtain, under the enter screen.
  const [curtainClosed, setCurtainClosed] = useState(!skipsEntry)
  // 'loading', 'ready' (Enter can be clicked), 'entered'.
  const [entry, setEntry] = useState(skipsEntry ? 'entered' : 'loading')
  const [scrollPositions] = useState(readScrollPositions)
  // 'entry' (until Enter), 'idle', 'closing', 'closed' (waiting for the
  // URL to commit), 'opening'. A page change asked for during the entry
  // waits for it to end.
  const phase = useRef(skipsEntry ? 'idle' : 'entry')
  const firstPage = useRef(true)
  const latest = useRef({ outlet, location, navigationType })

  useLayoutEffect(() => {
    latest.current = { outlet, location, navigationType }
  })

  // A lazily loaded page commits its URL only once fetched: the pending
  // navigation starts the curtain on the click, not after the download.
  const targetPathname = (navigation.location ?? location).pathname

  // Starts a transition, or the one requested while the last was still
  // running once it is over.
  useEffect(() => {
    if (phase.current !== 'idle' || targetPathname === page.location.pathname) return

    phase.current = 'closing'
    scrollPositions.set(page.location.key, window.scrollY)
    lenis?.stop()
    markPageHidden()
    curtainRef.current.close().then(() => {
      phase.current = 'closed'
      setCurtainClosed(true)
    })
  }, [targetPathname, page, curtainClosed, lenis, scrollPositions])

  const reveal = async () => {
    await curtainRef.current.open({ lead: ARRIVAL_LEAD, onLead: markPageArriving })
    markPageShown()
    phase.current = 'idle'
    setCurtainClosed(false)
  }

  // Behind the closed curtain, swaps in the latest page once its URL has
  // committed. Back to the page already on screen, it only reopens.
  useEffect(() => {
    if (phase.current !== 'closed' || navigation.state !== 'idle') return

    phase.current = 'opening'
    const next = latest.current
    if (next.location.key !== page.location.key) setPage(next)
    else {
      lenis?.start()
      reveal()
    }
  }, [curtainClosed, navigation.state, location, page, lenis])

  // A link to the page already on screen changes the URL but not the page:
  // it stays in place and scrolls back to the top.
  useEffect(() => {
    if (phase.current !== 'idle' || location.pathname !== page.location.pathname) return
    if (location.key === page.location.key) return

    setPage(latest.current)
    if (navigationType !== 'POP' && !location.hash) lenis?.scrollTo(0)
  }, [location, navigationType, page, lenis])

  // Runs after the new page's own layout effects, so its ScrollTriggers
  // already exist when the page is measured.
  useLayoutEffect(() => {
    document.title = pageTitle(page.location.pathname) ?? NOT_FOUND_TITLE

    if (firstPage.current) {
      firstPage.current = false
      if (skipsEntry) {
        markPageShown()
        return
      }

      const saved = scrollPositions.get(page.location.key)
      if (saved !== undefined) window.scrollTo(0, saved)
      // Enter starts the music, so it waits for it too, and for every photo
      // of the page: the site is its photographs, and none should ever be
      // seen loading.
      waitForPageReady({
        alsoWaitFor: [loadSoundtrack()],
        allImages: true,
        timeout: ENTRY_TIMEOUT,
      }).then(() => setEntry('ready'))
      return
    }

    if (phase.current !== 'opening') return

    // The load event that measured every trigger in refreshPriority order
    // never fires again, and Lenis would otherwise measure the new height
    // up to 250ms late.
    ScrollTrigger.refresh()
    lenis.resize()

    const { location: shown, navigationType: arrivedBy } = page
    const target = arrivedBy === 'POP' ? (scrollPositions.get(shown.key) ?? 0) : shown.hash || 0
    lenis.scrollTo(target, { immediate: true, force: true })

    // The curtain only opens on a page ready to be seen, so the heavy work
    // of showing it (decoding photos, splitting text) never lands on the
    // opening's frames. Scrolling stays locked until then, so the page
    // can't move away from where it was prepared.
    waitForPageReady().then(() => {
      lenis.start()
      reveal()
    })
  }, [page, lenis, scrollPositions, skipsEntry])

  // Until Enter, the page can't be scrolled (Lenis only exists after the
  // first render, hence an effect) nor reached by keyboard or screen
  // reader: #root is inert, the enter screen sits outside it.
  useEffect(() => {
    if (entry !== 'entered') lenis?.stop()
  }, [entry, lenis])

  useEffect(() => {
    document.getElementById('root').inert = entry !== 'entered'
    document.documentElement.classList.toggle('is-entering', entry !== 'entered')
  }, [entry])

  // The music starts first, while still inside the click. The curtain
  // opens once the enter screen's texts have fully left. Reached through
  // the promise, so outside the enter screen's GSAP context: a context
  // still active would adopt the curtain's, and revert it on unmount.
  const enter = () => {
    enterSoundtrack()
    startPrefetching()
    enterScreenRef.current.leave().then(() => {
      setEntry('entered')
      lenis?.start()
      reveal()
    })
  }

  useEffect(() => {
    const savePositions = () => {
      scrollPositions.set(latest.current.location.key, window.scrollY)
      try {
        sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify([...scrollPositions]))
      } catch {
        // Storage can be unavailable (private browsing); positions then
        // simply don't survive a reload.
      }
    }

    window.addEventListener('pagehide', savePositions)
    return () => window.removeEventListener('pagehide', savePositions)
  }, [scrollPositions])

  // The URL's own page while it is the one on screen, so the element stays
  // current; the frozen one while the curtain covers the change.
  const shownOutlet = location.pathname === page.location.pathname ? outlet : page.outlet

  return (
    <>
      {shownOutlet}
      <Curtain ref={curtainRef} startClosed={!skipsEntry} />
      {entry !== 'entered' && <EnterScreen ref={enterScreenRef} ready={entry === 'ready'} onEnter={enter} />}
    </>
  )
}

export default PageTransition
