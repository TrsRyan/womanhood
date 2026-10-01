import { useImperativeHandle, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Curtain.css'

// Most bands any layout uses (desktop). Curtain.css hides the extra ones
// on tablet (8) and mobile (4).
const BAND_COUNT = 12
const CURTAIN_DURATION = 0.8
const CURTAIN_EASE = 'power3.inOut'
// Delay between two bands, starting from the rightmost.
const CURTAIN_STAGGER = 0.05
// Reduced motion: the black fades in and out instead of sweeping.
const CURTAIN_FADE_DURATION = 0.3

// Full-screen black curtain made of vertical bands. Both moves sweep from
// right to left: closing, each band grows from its right edge; opening, it
// shrinks towards its left edge. The parent drives it through the ref:
// close() and open() return a Promise resolved once the move is over,
// cover() blacks the screen out at once. open({ lead, onLead }) also calls
// onLead `lead` seconds before the opening ends.
function Curtain({ ref }) {
  const rootRef = useRef(null)
  const { contextSafe } = useGSAP({ scope: rootRef })

  useImperativeHandle(ref, () => {
    // Only the bands the current layout shows, so the stagger timing is
    // the same on every screen size.
    const visibleBands = () =>
      gsap.utils.toArray('.curtain__band', rootRef.current).filter((band) => band.offsetWidth > 0)

    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const setClosed = (closed) => rootRef.current.classList.toggle('curtain--closed', closed)

    const sweep = (bands, vars) =>
      new Promise((resolve) => {
        gsap.to(bands, {
          ...vars,
          duration: CURTAIN_DURATION,
          ease: CURTAIN_EASE,
          stagger: { each: CURTAIN_STAGGER, from: 'end' },
          overwrite: true,
          onComplete: resolve,
        })
      })

    const fade = (opacity) =>
      new Promise((resolve) => {
        gsap.to(rootRef.current, { opacity, duration: CURTAIN_FADE_DURATION, ease: 'none', overwrite: true, onComplete: resolve })
      })

    return {
      close: contextSafe(async () => {
        const bands = visibleBands()

        if (reducedMotion()) {
          gsap.set(rootRef.current, { opacity: 0 })
          gsap.set(bands, { scaleX: 1 })
          await fade(1)
        } else {
          gsap.set(bands, { transformOrigin: 'right' })
          await sweep(bands, { scaleX: 1 })
        }

        setClosed(true)
      }),

      open: contextSafe(async ({ lead = 0, onLead } = {}) => {
        const bands = visibleBands()
        setClosed(false)

        if (onLead) {
          const length = reducedMotion()
            ? CURTAIN_FADE_DURATION
            : CURTAIN_DURATION + CURTAIN_STAGGER * (bands.length - 1)
          gsap.delayedCall(Math.max(0, length - lead), onLead)
        }

        if (reducedMotion()) {
          await fade(0)
          gsap.set(bands, { scaleX: 0 })
          gsap.set(rootRef.current, { opacity: 1 })
        } else {
          gsap.set(bands, { transformOrigin: 'left' })
          await sweep(bands, { scaleX: 0 })
        }
      }),

      cover: contextSafe(() => {
        gsap.set(visibleBands(), { scaleX: 1 })
        setClosed(true)
      }),
    }
  }, [contextSafe])

  return (
    <div className="curtain" ref={rootRef} aria-hidden="true">
      {Array.from({ length: BAND_COUNT }, (_, index) => (
        <span key={index} className="curtain__band" />
      ))}
    </div>
  )
}

export default Curtain
