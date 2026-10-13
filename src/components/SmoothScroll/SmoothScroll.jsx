import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const REDUCE_MOTION = '(prefers-reduced-motion: reduce)'

// Lenis's documented GSAP setup, shared by every page: gsap.ticker drives
// Lenis (autoRaf off), and each Lenis scroll updates ScrollTrigger, so
// smooth scroll and scroll animations run on one clock.
function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  // Reduced motion: wheel scrolling goes back to native steps.
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCE_MOTION).matches)

  useEffect(() => {
    const mq = window.matchMedia(REDUCE_MOTION)
    const apply = () => setReduced(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLenis(ScrollTrigger.update)

  useEffect(() => {
    const update = (time) => lenisRef.current?.lenis?.raf(time * 1000)

    // Prioritized: Lenis reads and sets the scroll at the very start of
    // each frame, before GSAP renders. After it, reading the scroll would
    // force the browser to lay out the page GSAP has just changed, on
    // every frame of a scroll.
    gsap.ticker.add(update, false, true)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false, smoothWheel: !reduced }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
