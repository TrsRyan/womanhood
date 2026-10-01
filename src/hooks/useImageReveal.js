import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteOpen } from '../animation/siteOpen.js'

gsap.registerPlugin(ScrollTrigger)

// The images' entrance, in the spirit of the letters' fade (textReveal.js).
// autoAlpha also hides the image while it is transparent, so the browser
// doesn't draw it for nothing.
const IMAGE_REVEAL_FROM = { autoAlpha: 0 }
const IMAGE_REVEAL_TO = { autoAlpha: 1, ease: 'power1.out', duration: 0.9 }
// Images reaching the screen together (side by side) follow one another
// by this much, in page order, instead of appearing as one.
const IMAGE_REVEAL_STAGGER = 0.15

// Fades in every [data-image-reveal] image inside `scopeRef` on the same
// beat as the texts: once its top reaches 90% of the screen. It resets
// only once it is back below the screen, out of sight, so it plays again
// on the next pass. Those on screen at load wait for Enter.
function useImageReveal(scopeRef) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const images = gsap.utils.toArray('[data-image-reveal]', scopeRef.current)
      const reveals = new Map(
        images.map((image) => [image, gsap.fromTo(image, IMAGE_REVEAL_FROM, { ...IMAGE_REVEAL_TO, paused: true })]),
      )

      // ScrollTrigger.batch groups the images whose trigger fires in the
      // same moment, so they can be staggered. Two batches, as GSAP
      // recommends for playing and resetting at different points;
      // refreshPriority -1 measures them after any pin above has added its
      // scroll distance.
      ScrollTrigger.batch(images, {
        start: 'top 90%',
        refreshPriority: -1,
        onEnter: (batch) =>
          siteOpen.then(() =>
            batch.forEach((image, index) => reveals.get(image).delay(index * IMAGE_REVEAL_STAGGER).restart(true)),
          ),
      })

      ScrollTrigger.batch(images, {
        start: 'top bottom',
        refreshPriority: -1,
        onLeaveBack: (batch) => batch.forEach((image) => reveals.get(image).pause(0)),
      })
    })
  }, { scope: scopeRef })
}

export default useImageReveal
