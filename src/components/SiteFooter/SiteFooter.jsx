import { useRef } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// An SVG <image> takes a single file, no srcset: one WebP wide enough for
// the wordmark's full width on a high-density screen.
import transitionImage from '../../assets/transition-image.jpg?w=2560&format=webp'
import { WORDMARK_HEIGHT, WORDMARK_LETTERS, WORDMARK_WIDTH } from './wordmark-letters.js'
import RollText from '../RollText/RollText.jsx'
import useTextReveal from '../../hooks/useTextReveal.js'
import './SiteFooter.css'

gsap.registerPlugin(ScrollTrigger)

const PHOTO_PATTERN_ID = 'site-footer-photo'

function SiteFooter() {
  const footerRef = useRef(null)
  const contentRef = useRef(null)
  const shadeRef = useRef(null)

  // The page scrolls off the footer like a curtain: the content starts
  // shifted up by its own height and slides back as the footer scrolls into
  // view, cancelling out the scroll, so it holds still on screen while it
  // is uncovered. It stays in flow, not position:fixed, so the whole footer
  // moves with the page in iOS's overscroll bounce. The shade lifts over
  // the same distance: black when the footer's top reaches the bottom of
  // the screen, gone once it is fully uncovered.
  // refreshPriority -1: these ScrollTriggers are created before the ones
  // above them on the page (child effects run first), so they must be
  // measured after their pins have added their scroll distance.
  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        refreshPriority: -1,
      },
    })
      .fromTo(contentRef.current, { yPercent: -100 }, { yPercent: 0, ease: 'none' }, 0)
      .fromTo(shadeRef.current, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)

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

  // Played on the footer's own uncovering, not on the texts' positions:
  // they sit at its top, under the page until the very end. Starting at
  // 90% uncovered, the wave is still running as the page clears them.
  useTextReveal(footerRef, { triggerRef: footerRef, start: 'bottom-=10% bottom' })

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer__content" ref={contentRef}>
        <div className="site-footer__legacy">
          <p data-text-reveal>© 2023 Womanhood</p>
          <Link to="/archive" data-text-reveal><RollText>Cookie Preferences</RollText></Link>
          <Link to="/archive" data-text-reveal><RollText>Privacy Policy</RollText></Link>
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
