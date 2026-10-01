import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteOpen } from '../animation/siteOpen.js'

gsap.registerPlugin(ScrollTrigger)

// The images' entrance, in the spirit of the letters' fade (textReveal.js).
// autoAlpha also hides the image while it is transparent, so the browser
// doesn't draw it for nothing.
const IMAGE_REVEAL_FROM = { autoAlpha: 0 }
const IMAGE_REVEAL_TO = { autoAlpha: 1, ease: 'power1.out', duration: 1.2 }

// Fades in every [data-image-reveal] image inside `scopeRef` on the same
// beat as the texts: once its top reaches 90% of the screen. It resets
// only once it is back below the screen, out of sight, so it plays again
// on the next pass. One on screen at load waits for Enter.
function useImageReveal(scopeRef) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('[data-image-reveal]', scopeRef.current).forEach((image) => {
        const reveal = gsap.fromTo(image, IMAGE_REVEAL_FROM, { ...IMAGE_REVEAL_TO, paused: true })

        // Two triggers, as GSAP recommends for playing and resetting at
        // different points. refreshPriority -1 measures them after any pin
        // above has added its scroll distance.
        ScrollTrigger.create({
          trigger: image,
          start: 'top 90%',
          refreshPriority: -1,
          onEnter: () => siteOpen.then(() => reveal.play()),
        })

        ScrollTrigger.create({
          trigger: image,
          start: 'top bottom',
          refreshPriority: -1,
          onLeaveBack: () => reveal.pause(0),
        })
      })
    })
  }, { scope: scopeRef })
}

export default useImageReveal
