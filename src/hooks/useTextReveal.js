import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createTextReveal } from '../animation/textReveal.js'
import { siteOpen } from '../animation/siteOpen.js'
import { isPageShown, whenPageShown } from '../animation/pageShown.js'
import { whenFontsLoaded } from '../animation/fonts.js'

gsap.registerPlugin(ScrollTrigger)

// Plays the text reveal (see createTextReveal) of every [data-text-reveal]
// element inside `scopeRef` on scroll: once its top reaches 90% of the
// screen. It rewinds only once it is back below the screen, out of sight,
// so it plays again on the next pass. `triggerRef` and `start` hand the
// play to another element, for texts that should appear together with it.
function useTextReveal(scopeRef, { triggerRef, start = 'top 90%' } = {}) {
  useGSAP((context, contextSafe) => {
    // Split only once the font is in (see fonts.js): splitting with the
    // fallback font measures lines and kerning that the real font then
    // changes. The texts stay hidden until then (index.css).
    let unmounted = false

    const setUp = contextSafe(() => {
      if (unmounted) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', (mmContext, mmContextSafe) => {
        const elements = gsap.utils.toArray('[data-text-reveal]', scopeRef.current)

        // Splitting a text lays the page out, and splitting them all at
        // once held a page change for over a second. So each text is
        // split only once needed: at once if it is on screen when the page
        // shows, otherwise one at a time while the browser is idle after
        // the curtain has opened, or a screen before it scrolls into view,
        // whichever comes first. Off screen, a text stays hidden until
        // then (index.css).
        const reveals = new Map()
        const prepare = mmContextSafe((element) => {
          if (!reveals.has(element)) reveals.set(element, createTextReveal(element))
          return reveals.get(element)
        })

        elements.forEach((element) => {
          const box = element.getBoundingClientRect()
          if (box.bottom > 0 && box.top < window.innerHeight) prepare(element)

          // Three triggers: one prepares the text ahead, and two play and
          // reset it at different points, as GSAP recommends. refreshPriority
          // -1 measures them after any pin above has added its scroll
          // distance.
          const trigger = triggerRef?.current ?? element

          ScrollTrigger.create({
            trigger,
            start: 'top bottom+=100%',
            refreshPriority: -1,
            onEnter: () => prepare(element),
          })

          // A text already on screen at load waits for Enter, so it plays
          // as the site opens rather than behind the enter screen.
          ScrollTrigger.create({
            trigger,
            start,
            refreshPriority: -1,
            onEnter: () => siteOpen.then(() => prepare(element).play()),
          })

          ScrollTrigger.create({
            trigger,
            start: 'top bottom',
            refreshPriority: -1,
            onLeaveBack: () => reveals.get(element)?.rewind(),
          })
        })

        // Safari has no requestIdleCallback; a short delay stands in for it.
        const whenIdle = window.requestIdleCallback?.bind(window) ?? ((callback) => setTimeout(callback, 50))
        let stopped = false

        // Checked again when idle: the curtain may have started closing
        // since, and the step then waits for the next page to show.
        const prepareNextWhenIdle = () => {
          whenPageShown().then(() =>
            whenIdle(() => {
              const next = elements.find((element) => !reveals.has(element))
              if (stopped || !next) return
              if (isPageShown()) prepare(next)
              prepareNextWhenIdle()
            }),
          )
        }
        prepareNextWhenIdle()

        return () => {
          stopped = true
          reveals.forEach((reveal) => reveal.kill())
        }
      })
    })

    whenFontsLoaded().then(setUp)

    return () => {
      unmounted = true
    }
  }, { scope: scopeRef })
}

export default useTextReveal
