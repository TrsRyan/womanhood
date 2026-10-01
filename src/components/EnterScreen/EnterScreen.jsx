import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import RollText from '../RollText/RollText.jsx'
import { whenFontsLoaded } from '../../animation/fonts.js'
import {
  CHAR_STAGGER,
  FADE_DURATION,
  FADE_EASE,
  REVEAL_DURATION,
  REVEAL_EASE,
  createTextReveal,
} from '../../animation/textReveal.js'
import './EnterScreen.css'

// Seconds of black before anything moves, so the eye is settled when the
// first letters rise.
const INTRO_DELAY = 0.5
// The counter rises this long after the credit.
const COUNTER_OFFSET = 0.15
// Seconds into its rise at which the counter starts counting.
const COUNT_DELAY = 0.6
// The count is paced for the eye, not by the download: one curve from 0
// to 100, held at COUNT_HOLD until the page is really ready, so 100 is
// only ever shown once it is true (the usual preloader pattern).
const COUNT_DURATION = 2.4
const COUNT_EASE = 'power2.inOut'
const COUNT_HOLD = 90
// Pause at 100 before Enter rises.
const COUNT_BREATH = 0.3
// Leaving, the letters drop back below their lines, in the reveal's order.
const EXIT_DURATION = 0.5
const EXIT_EASE = 'power2.in'
// While the intro plays, any frame longer than this (ms) counts as one of
// INTRO_LAG_STEP: an animation caught by the browser stalling (the page
// behind loads and decodes its photos meanwhile) pauses through it and
// carries on, instead of jumping ahead to where the lost time puts it.
const INTRO_LAG_THRESHOLD = 100
const INTRO_LAG_STEP = 33

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Shown over the closed curtain on every full page load. After a beat of
// black, the credit then the counter rise in with the site's text reveal,
// the counter counts to 100, then "Enter with Sound" rises in. The click
// is also the gesture browsers require before a site may play sound; the
// label announces it, and the header's toggle turns it off. Rendered
// outside #root, which is inert meanwhile, so the button is the only
// focusable control: a single Tab reaches it, once shown.
//
// `ready` says the page behind is prepared. The parent drives the exit
// through the ref: leave() returns a Promise resolved once it is over.
function EnterScreen({ ref, ready, onEnter }) {
  const rootRef = useRef(null)
  const creditRef = useRef(null)
  const countRef = useRef(null)
  const buttonRef = useRef(null)
  const counting = useRef(null)
  const holding = useRef(false)
  const loaded = useRef(ready)
  const leaving = useRef(false)
  const [counted, setCounted] = useState(false)
  const { contextSafe } = useGSAP({ scope: rootRef })

  // The credit is split once the font is in (see fonts.js); the counter
  // isn't split, since its text keeps changing, and rises as one piece
  // with the same motion. Under reduced motion only the count runs.
  useGSAP((context, contextSafeSetUp) => {
    const motion = !reducedMotion()
    if (motion) gsap.set(countRef.current, { yPercent: 110, opacity: 0 })

    const state = { value: 0 }
    counting.current = gsap.to(state, {
      value: 100,
      duration: COUNT_DURATION,
      ease: COUNT_EASE,
      paused: true,
      onUpdate: () => {
        countRef.current.textContent = `${Math.floor(state.value)}%`
        if (!loaded.current && state.value >= COUNT_HOLD) {
          holding.current = true
          counting.current.pause()
        }
      },
      onComplete: () => gsap.delayedCall(COUNT_BREATH, () => setCounted(true)),
    })

    let unmounted = false
    let credit

    // Set from here, after mount: SmoothScroll turns lag smoothing off when
    // it mounts (Lenis must stay in step with the real time), and that
    // happens after this component's own mount effects. Off again on the
    // way out, once Lenis has the page.
    whenFontsLoaded().then(
      contextSafeSetUp(() => {
        if (unmounted) return
        gsap.ticker.lagSmoothing(INTRO_LAG_THRESHOLD, INTRO_LAG_STEP)
        const intro = gsap.timeline({ delay: INTRO_DELAY })

        if (motion) {
          credit = createTextReveal(creditRef.current)
          intro
            .add(() => credit.play(), 0)
            .to(countRef.current, { yPercent: 0, ease: REVEAL_EASE, duration: REVEAL_DURATION }, COUNTER_OFFSET)
            .to(countRef.current, { opacity: 1, ease: FADE_EASE, duration: FADE_DURATION }, COUNTER_OFFSET)
        }

        intro.add(() => counting.current.play(), motion ? COUNTER_OFFSET + COUNT_DELAY : 0)
      }),
    )

    return () => {
      unmounted = true
      credit?.kill()
      gsap.ticker.lagSmoothing(0)
    }
  }, { scope: rootRef })

  // Ready while the count holds: it carries on to 100.
  useEffect(() => {
    if (!ready) return
    loaded.current = true
    if (holding.current) {
      holding.current = false
      counting.current.play()
    }
  }, [ready])

  // The button is laid out from the start, invisible, so the row never
  // shifts; at 100% its letters, split by its RollText since mounting,
  // rise in.
  useGSAP(() => {
    if (!counted || reducedMotion()) return
    const button = createTextReveal(buttonRef.current)
    button.play()
    return () => button.kill()
  }, { dependencies: [counted], scope: rootRef })

  useImperativeHandle(ref, () => {
    const drop = contextSafe((letters) =>
      new Promise((resolve) => {
        gsap.to(letters, {
          yPercent: 110,
          opacity: 0,
          ease: EXIT_EASE,
          duration: EXIT_DURATION,
          stagger: CHAR_STAGGER,
          overwrite: 'auto',
          onComplete: resolve,
        })
      }),
    )

    const fade = contextSafe((element) =>
      new Promise((resolve) => {
        gsap.to(element, { opacity: 0, ease: FADE_EASE, duration: EXIT_DURATION, onComplete: resolve })
      }),
    )

    return {
      // The credit's letters and the counter drop. Enter fades as a whole
      // instead: clicked mid hover roll, its letters and their copy are
      // both partly in view, and dropping them would show the copy.
      // Resolves on the exits' own completion, once everything is out of
      // sight, so whatever follows can never start early.
      leave() {
        if (reducedMotion()) return Promise.resolve()

        return Promise.all([
          drop(gsap.utils.toArray('.enter-screen__credit .text-reveal__char, .enter-screen__count', rootRef.current)),
          fade(buttonRef.current),
        ])
      },
    }
  }, [contextSafe])

  const enter = () => {
    if (leaving.current) return
    leaving.current = true
    onEnter()
  }

  return createPortal(
    <div className="enter-screen" ref={rootRef}>
      <div className="enter-screen__row">
        <p className="enter-screen__credit" ref={creditRef} data-text-reveal>
          ©&nbsp;2023 WoManHood
        </p>
        <button
          ref={buttonRef}
          type="button"
          className={counted ? 'enter-screen__button' : 'enter-screen__button enter-screen__button--waiting'}
          onClick={enter}
          data-text-reveal
        >
          <RollText>Enter with Sound</RollText>
        </button>
        <p className="enter-screen__progress">
          <span className="enter-screen__count" ref={countRef}>0%</span>
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default EnterScreen
