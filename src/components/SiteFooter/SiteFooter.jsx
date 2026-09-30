import { useLayoutEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import transitionImage from '../../assets/transition-image.jpg'
import { WORDMARK_HEIGHT, WORDMARK_LETTERS, WORDMARK_WIDTH } from './wordmark-letters.js'
import './SiteFooter.css'

gsap.registerPlugin(ScrollTrigger)

const PHOTO_PATTERN_ID = 'site-footer-photo'

function SiteFooter() {
  const footerRef = useRef(null)
  const contentRef = useRef(null)
  const shadeRef = useRef(null)

  // The content is position:fixed, so it can't size its own window:
  // the window copies its height, now and whenever it changes (breakpoint,
  // font load). Set before paint and before the page's ScrollTriggers
  // measure it.
  useLayoutEffect(() => {
    const footer = footerRef.current
    const content = contentRef.current
    const syncHeight = () => {
      footer.style.height = `${content.getBoundingClientRect().height}px`
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  // The shade lifts as the window scrolls into view: black when its top
  // reaches the bottom of the screen, gone once it is fully uncovered.
  // refreshPriority -1: this ScrollTrigger is created before the ones
  // above it on the page (child effects run first), so it must be
  // measured after their pins have added their scroll distance.
  useGSAP(() => {
    gsap.fromTo(shadeRef.current, { opacity: 1 }, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        refreshPriority: -1,
      },
    })

    // The letters rise one after another from below the wordmark, where
    // the SVG's own overflow clipping hides them, with the same ease as
    // the pin-gallery questions. Played rather than scrubbed, once the
    // footer is half uncovered so the shade doesn't hide it.
    const lettersReveal = gsap.fromTo('.site-footer__letter', { y: WORDMARK_HEIGHT }, {
      y: 0,
      ease: 'power3.out',
      duration: 0.9,
      stagger: 0.04,
      paused: true,
    })

    // Two triggers, as GSAP recommends for playing and resetting at
    // different points: the reveal plays half way in, and only rewinds,
    // instantly, once the page has fully covered the footer again, so the
    // reset is never seen and the next visit always starts from scratch.
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'center bottom',
      onEnter: () => lettersReveal.play(),
      refreshPriority: -1,
    })

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top bottom',
      onLeaveBack: () => lettersReveal.pause(0),
      refreshPriority: -1,
    })
  }, { scope: footerRef })

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer__content" ref={contentRef}>
        <div className="site-footer__legacy">
          <p>© 2023 Womanhood</p>
          <a href="/archive.html">Cookie Preferences</a>
          <a href="/archive.html">Privacy Policy</a>
        </div>

        {/* Each letter is drawn twice: filled with the photo, then in black
            on top. Hovering a letter fades its black copy out. The pattern
            spans the whole wordmark, so the letters share one photo. */}
        <svg className="site-footer__wordmark" viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} role="img" aria-label="WoManHood">
          <defs>
            <pattern id={PHOTO_PATTERN_ID} patternUnits="userSpaceOnUse" width={WORDMARK_WIDTH} height={WORDMARK_HEIGHT}>
              <image href={transitionImage} width={WORDMARK_WIDTH} height={WORDMARK_HEIGHT} preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>

          {WORDMARK_LETTERS.map(({ path }, index) => (
            <g key={index} className="site-footer__letter">
              <path d={path} fill={`url(#${PHOTO_PATTERN_ID})`} />
              <path className="site-footer__letter-ink" d={path} />
            </g>
          ))}
        </svg>

        <div className="site-footer__shade" aria-hidden="true" ref={shadeRef} />
      </div>
    </footer>
  )
}

export default SiteFooter
