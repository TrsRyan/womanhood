import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import './RollText.css'

gsap.registerPlugin(CustomEase, SplitText)

// A short wind-up, then a fast rise that brakes long (Osmo's button curve).
const ROLL_EASE = CustomEase.create('roll', 'M0,0 C0.625,0.05 0,1 1,1')
const ROLL_DURATION = 0.8
// Kept tight so a long label still finishes quickly.
const ROLL_STAGGER = 0.01

// Text that rolls up letter by letter on hover, replaced by an identical
// copy rising from below. It only plays on the way in: once the copy has
// taken over, both snap back unseen (the two are identical), so every
// hover rolls upward again. A hover while it plays is ignored rather than
// restarting it mid-roll. Mouse only, and off when reduced motion is asked.
// With `underline`, a line under the label wipes out to the right and back
// in from the left during the roll.
function RollText({ children, underline = false }) {
  const rootRef = useRef(null)
  const originalRef = useRef(null)
  const copyRef = useRef(null)
  const underlineRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const root = rootRef.current
      const originalChars = SplitText.create(originalRef.current, { type: 'chars' }).chars
      const copyChars = SplitText.create(copyRef.current, { type: 'chars' }).chars

      // The copy's box already sits one line lower (RollText.css), so both
      // sets make the same move, started together so each letter stays
      // paired with its copy.
      const rise = { yPercent: -100, ease: ROLL_EASE, duration: ROLL_DURATION, stagger: ROLL_STAGGER }
      const roll = gsap.timeline({ paused: true, onComplete: () => roll.pause(0) })
        .to(originalChars, rise, 0)
        .to(copyChars, rise, 0)

      // The wipe is laid out linearly, then played through the roll's own
      // ease over the roll's full length: the line keeps the letters' pace,
      // and swaps sides at their fastest point, half way up.
      if (underline) {
        const wipe = gsap.timeline({ paused: true })
          .to(underlineRef.current, { scaleX: 0, ease: 'none', duration: 1 })
          .set(underlineRef.current, { transformOrigin: 'left' })
          .to(underlineRef.current, { scaleX: 1, ease: 'none', duration: 1 })

        roll.add(wipe.tweenFromTo(0, wipe.duration(), { ease: ROLL_EASE, duration: roll.duration() }), 0)
      }

      // A link marking where the reader already is (aria-current) reads as
      // a position, not an invitation, so it doesn't roll.
      const onEnter = () => {
        if (root.closest('[aria-current]') || roll.isActive()) return
        roll.restart()
      }

      root.addEventListener('mouseenter', onEnter)
      return () => root.removeEventListener('mouseenter', onEnter)
    })
  }, { scope: rootRef })

  return (
    <span className="roll-text" ref={rootRef}>
      <span className="roll-text__mask">
        <span className="roll-text__line" ref={originalRef}>{children}</span>
        <span className="roll-text__line roll-text__line--copy" aria-hidden="true" ref={copyRef}>{children}</span>
      </span>
      {underline && <span className="roll-text__underline" aria-hidden="true" ref={underlineRef} />}
    </span>
  )
}

export default RollText
