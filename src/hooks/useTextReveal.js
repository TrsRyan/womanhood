import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createTextReveal } from '../animation/textReveal.js'

gsap.registerPlugin(ScrollTrigger)

// Plays the text reveal (see createTextReveal) of every [data-text-reveal]
// element inside `scopeRef` on scroll: once its top reaches 90% of the
// screen. It rewinds only once it is back below the screen, out of sight,
// so it plays again on the next pass. `triggerRef` and `start` hand the
// play to another element, for texts that should appear together with it.
function useTextReveal(scopeRef, { triggerRef, start = 'top 90%' } = {}) {
  useGSAP((context, contextSafe) => {
    // Split only once the fonts are in (GSAP's advice): splitting with the
    // fallback font measures lines and kerning that the real font then
    // changes. The texts stay hidden until then (index.css).
    let unmounted = false

    const setUp = contextSafe(() => {
      if (unmounted) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const reveals = gsap.utils.toArray('[data-text-reveal]', scopeRef.current).map((element) => {
          const reveal = createTextReveal(element)

          // Two triggers, as GSAP recommends for playing and resetting at
          // different points. refreshPriority -1 measures them after any
          // pin above has added its scroll distance.
          const trigger = triggerRef?.current ?? element

          ScrollTrigger.create({
            trigger,
            start,
            refreshPriority: -1,
            onEnter: () => reveal.play(),
          })

          ScrollTrigger.create({
            trigger,
            start: 'top bottom',
            refreshPriority: -1,
            onLeaveBack: () => reveal.rewind(),
          })

          return reveal
        })

        return () => reveals.forEach((reveal) => reveal.kill())
      })
    })

    document.fonts.ready.then(setUp)

    return () => {
      unmounted = true
    }
  }, { scope: scopeRef })
}

export default useTextReveal
