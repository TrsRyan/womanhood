import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import './App.css'
import transitionImage from './assets/transition-image.jpg'
import introPrimary from './assets/intro-primary.jpg'
import introSecondary from './assets/intro-secondary.jpg'
import narrativeBackground from './assets/narrative-background.jpg'
import documentaryCover from './assets/documentary-cover.png'
import documentaryFeature from './assets/documentary-feature.png'
import pinGallery1 from './assets/pin-gallery-1.jpg'
import pinGallery2 from './assets/pin-gallery-2.png'
import pinGallery3 from './assets/pin-gallery-3.jpg'
import pinGallery4 from './assets/pin-gallery-4.jpg'

const SITE_GRID_COLUMNS = 36

// Pin-gallery timeline rhythm, in timeline units (one image entry = 1).
const PIN_GALLERY_HOLD = 0.1
const PIN_GALLERY_OVERLAP = 0.3
// Scrubbed tweens replay backwards on scroll-up, so every ease is
// symmetric: an image grows and shrinks the same way in both directions.
const PIN_GALLERY_EASE = 'power1.inOut'
// Empty time after the last tween: the numeric scrub lags behind the
// scroll, and the questions reveal on their own clock, so the pin must
// outlast both or it releases mid-morph or mid-reveal.
const PIN_GALLERY_END_HOLD = 1
// How long each word of the lead takes to turn from gray to black.
const PIN_GALLERY_WORD_FILL = 0.3

gsap.registerPlugin(ScrollTrigger, Flip, SplitText)

function App() {
  const transitionImageRef = useRef(null)
  const heroRef = useRef(null)
  const transitionSpacerRef = useRef(null)
  const pinGalleryRef = useRef(null)
  const pinGalleryStageRef = useRef(null)
  const lenis = useLenis()

  useGSAP(() => {
    if (!lenis) return

    // Lenis's documented GSAP setup: autoRaf is off (main.jsx) and
    // gsap.ticker drives Lenis, so both run on one shared clock.
    const syncLenis = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(syncLenis)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    // One timeline over the hero + spacer window: the parallax (yPercent)
    // runs throughout, the dezoom and the fade to the black backdrop only
    // near the end. While they overlap, scale must stay >= 1 +
    // |yPercent| / 50, or the image no longer covers the viewport and
    // an edge shows.
    const transitionImageTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        endTrigger: transitionSpacerRef.current,
        end: 'bottom top',
        scrub: true,
      },
    })

    transitionImageTimeline
      .fromTo(transitionImageRef.current, { yPercent: 8 }, { yPercent: -8, ease: 'none', duration: 1 }, 0)
      .fromTo(transitionImageRef.current, { scale: 1.22 }, { scale: 1.18, ease: 'none', duration: 0.4 }, 0.8)
      .fromTo(transitionImageRef.current, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.4 }, 0.8)

    return () => {
      gsap.ticker.remove(syncLenis)
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  // Gated on lenis like the block above so its ScrollTrigger is created
  // after the transition image's: ScrollTriggers must be created in page
  // order (top to bottom) to refresh correctly.
  useGSAP((context, contextSafe) => {
    if (!lenis) return

    const stage = pinGalleryStageRef.current

    // The stage is pinned, not the section: GSAP's pinSpacing then adds
    // the scroll distance below it. The numeric scrub eases the playhead
    // towards the scroll position on top of Lenis's own smoothing.
    const pinGalleryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: pinGalleryRef.current,
        pin: stage,
        start: 'top top',
        end: '+=1400%',
        scrub: 1.5,
      },
    })

    const images = gsap.utils.toArray('.pin-gallery__image', pinGalleryRef.current)
    const lastItem = pinGalleryRef.current.querySelector('.pin-gallery__item--4')
    // Entry (1) + hold + exit (1): how long each image spends crossing.
    const imageLifetime = 2 + PIN_GALLERY_HOLD

    // The travel distance and Flip.fit are both measured in pixels, so the
    // timeline is rebuilt whenever the stage itself changes size (GSAP's
    // recommended fix for Flip + resize). Only the tweens are rebuilt,
    // never the pin, so the page never jumps. The stage is 100lvh, which
    // ignores the mobile browser toolbar, so toolbar show/hide never
    // triggers a rebuild mid-scroll.
    let measuredSize = ''

    // Words don't depend on line breaks, so unlike the questions the lead
    // is split once, without autoSplit. The gray and black come from the
    // site's tokens rather than being repeated here; the lead's own CSS
    // color stays black, so the text still reads if the script never runs.
    const lead = pinGalleryRef.current.querySelector('.pin-gallery__lead')
    const leadWords = SplitText.create(lead, { type: 'words' }).words
    const leadGray = getComputedStyle(document.documentElement).getPropertyValue('--gray-text').trim()
    const leadBlack = getComputedStyle(lead).color

    const stageSize = () => `${stage.offsetWidth}x${stage.offsetHeight}`

    const buildTimeline = contextSafe(() => {
      measuredSize = stageSize()

      const time = pinGalleryTimeline.time()
      pinGalleryTimeline.clear()
      gsap.set([...images, lastItem], { clearProps: 'all' })

      // Each image scrolls up across the stage at a constant speed, from
      // just below it to just above it, while its scale (no opacity) grows
      // from 0 and shrinks back. The img owns both; its item is left to
      // Flip. Each entry starts slightly before the previous exit ends.
      images.forEach((image, index) => {
        const start = index * (imageLifetime - PIN_GALLERY_OVERLAP)
        const travel = (stage.offsetHeight + image.offsetHeight) / 2

        pinGalleryTimeline.fromTo(image, { scale: 0 }, { scale: 1, ease: PIN_GALLERY_EASE, duration: 1 }, start)

        if (index < images.length - 1) {
          pinGalleryTimeline
            .fromTo(image, { y: travel }, { y: -travel, ease: 'none', duration: imageLifetime }, start)
            .to(image, { scale: 0, ease: PIN_GALLERY_EASE, duration: 1 }, start + 1 + PIN_GALLERY_HOLD)
          return
        }

        // The last image eases to a stop at its grid position, then its
        // item is resized to cover the stage. absolute: lifts the item out
        // of the grid while it grows, so the grid's vertical centering
        // can't drift it off course.
        const settleDuration = imageLifetime / 2

        pinGalleryTimeline
          .fromTo(image, { y: travel }, { y: 0, ease: PIN_GALLERY_EASE, duration: settleDuration }, start)
          .add(
            Flip.fit(lastItem, stage, { absolute: true, ease: PIN_GALLERY_EASE, duration: 2.5 }),
            start + settleDuration + PIN_GALLERY_HOLD,
          )
      })

      // The lead fills in word by word, karaoke style, and is fully black
      // by the time the last image starts rising towards it. Linear ease,
      // so the fill tracks the scroll exactly.
      const lastImageStart = (images.length - 1) * (imageLifetime - PIN_GALLERY_OVERLAP)

      pinGalleryTimeline.fromTo(
        leadWords,
        { color: leadGray },
        {
          color: leadBlack,
          ease: 'none',
          duration: PIN_GALLERY_WORD_FILL,
          stagger: { amount: lastImageStart - PIN_GALLERY_WORD_FILL },
        },
        0,
      )

      // Marks the end of the morph: the questions reveal once the playhead
      // (not the scroll, which the scrub lags behind) passes it.
      pinGalleryTimeline.addLabel('questions')
      pinGalleryTimeline.to({}, { duration: PIN_GALLERY_END_HOLD })

      // Re-render at the current scroll position with the new measurements.
      // Events are suppressed so the rebuild never replays the questions.
      pinGalleryTimeline.time(0, true).time(time, true)
    })

    // The questions play on their own clock rather than the scroll. autoSplit
    // re-splits them once fonts load and whenever their width changes;
    // returning the reveal from onSplit lets SplitText swap it for one on
    // the new lines at the same progress.
    let questionsReveal
    let questionsShown = false

    const questions = gsap.utils.toArray('.pin-gallery__question', pinGalleryRef.current)

    SplitText.create(questions, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (split) => {
        // Left question first, the right one a beat later; within each
        // question, its lines follow one another.
        questionsReveal = gsap.timeline({ paused: true })
        questions.forEach((question, index) => {
          questionsReveal.fromTo(
            split.lines.filter((line) => question.contains(line)),
            { yPercent: 100 },
            { yPercent: 0, ease: 'power3.out', duration: 1.2, stagger: 0.08 },
            index * 0.25,
          )
        })
        return questionsReveal
      },
    })

    pinGalleryTimeline.eventCallback('onUpdate', () => {
      const shown = pinGalleryTimeline.time() >= pinGalleryTimeline.labels.questions
      if (shown === questionsShown) return

      questionsShown = shown
      if (shown) questionsReveal.play()
      else questionsReveal.reverse()
    })

    buildTimeline()

    const stageObserver = new ResizeObserver(() => {
      if (stageSize() !== measuredSize) buildTimeline()
    })
    stageObserver.observe(stage)

    return () => stageObserver.disconnect()
  }, { dependencies: [lenis], scope: pinGalleryRef })

  return (
    <>
      <div className="grid-overlay" aria-hidden="true">
        {Array.from({ length: SITE_GRID_COLUMNS }).map((_, index) => (
          <span key={index} className="grid-overlay__line" />
        ))}
      </div>

      <div className="transition-image__backdrop" aria-hidden="true" />

      <img className="transition-image__img" src={transitionImage} alt="" ref={transitionImageRef} />

      <header className="site-header">
        <a href="/" className="site-header__wordmark">WoManHood</a>
        <nav className="site-header__nav">
          <button type="button" className="site-header__sound-toggle">(Sound On),</button>
          <a href="/archive.html" className="site-header__archive-link">Archive</a>
        </nav>
      </header>

      <main>
        <section className="hero" ref={heroRef}>
          <div className="hero__tagline-row">
            <p className="hero__tagline">
              Three female characters searching for the fine line between Man and Woman. Blending fiction and reality, circus arts, music, and documentary.
            </p>
          </div>

          <span className="hero__title-clip">
            <span className="sr-only">WoManHood</span>
          </span>
        </section>

        <div className="transition-image__spacer" aria-hidden="true" ref={transitionSpacerRef} />

        <div className="page-content">
          <section className="intro">
            <div className="intro__media">
              <img className="intro__image intro__image--primary" src={introPrimary} alt="" />
              <img className="intro__image intro__image--secondary" src={introSecondary} alt="" />
              <p className="intro__copyright">©2023</p>
            </div>

            <div className="intro__text">
              <p className="intro__index-label">(01)</p>
              <p className="intro__paragraph intro__paragraph--first">
                WoManHood starts from something real. In the mountains of northern Albania, a family left without sons could turn to a daughter. She swore an oath of virginity and lived as a man from then on.
              </p>
              <p className="intro__paragraph intro__paragraph--second">
                They are called Burnesha, from the Albanian for &quot;like a man&quot;, and are often described as the last women in Europe to live as men. The tradition is fading. The inequality that produced it has not.
              </p>
            </div>
          </section>

          <section className="narrative">
            <img className="narrative__background" src={narrativeBackground} alt="" />

            <div className="narrative__header">
              <p className="narrative__index-label">(02)</p>
              <p className="narrative__title">From real life to the imaginary</p>
              <p className="narrative__description">
                A black box, almost no set. Aerial chain, contortion, live voice, autoharp and electronic effects play against documentary footage projected onto the stage, until it is no longer clear what is filmed and what is live.
              </p>
            </div>
          </section>

          <section className="documentary">
            <p className="documentary__index-label">(03)</p>

            <img className="documentary__image documentary__image--cover" src={documentaryCover} alt="" />

            <p className="documentary__note">
              Sound, spoken word, live interviews. Everything was gathered on location.
            </p>

            <p className="documentary__caption">Documentary, Albania</p>

            <div className="documentary__quote">
              <p className="documentary__quote-text">
                In 2014, while researching masculinity for the stage, Mille Lundt came across photographs of the Burnesha and never let the subject go. Years later the company went to find them: one in the northern mountains, another by the sea in Durrës.
              </p>
              <a className="documentary__quote-link" href="/archive.html">Read The Story</a>
            </div>

            <img className="documentary__image documentary__image--feature" src={documentaryFeature} alt="" />
          </section>

          {/* .pin-gallery__stage is the pinned element. The 4 items share
              grid-row 1 and overlap on purpose: the timeline shows one at a
              time. Each <img> owns its scroll-up and scale; its <figure>
              owns size/position (item 4 is resized by Flip), so the two
              animations never write to the same element.
              .pin-gallery__questions stays a sibling of the items, never
              nested in the one being resized. */}
          <section className="pin-gallery" ref={pinGalleryRef}>
            <div className="pin-gallery__stage" ref={pinGalleryStageRef}>
              <p className="pin-gallery__lead">
                Combining performance, circus arts, visual art, sound, and photography to push artistic boundaries.
              </p>

              <div className="pin-gallery__images">
                <figure className="pin-gallery__item pin-gallery__item--1">
                  <img className="pin-gallery__image" src={pinGallery1} alt="" />
                </figure>
                <figure className="pin-gallery__item pin-gallery__item--2">
                  <img className="pin-gallery__image" src={pinGallery2} alt="" />
                </figure>
                <figure className="pin-gallery__item pin-gallery__item--3">
                  <img className="pin-gallery__image" src={pinGallery3} alt="" />
                </figure>
                <figure className="pin-gallery__item pin-gallery__item--4">
                  <img className="pin-gallery__image" src={pinGallery4} alt="" />
                </figure>
              </div>

              <div className="pin-gallery__questions">
                <p className="pin-gallery__question pin-gallery__question--left">What is it to be a woman ?</p>
                <p className="pin-gallery__question pin-gallery__question--right">Why is it not enough to be a woman ?</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__legacy">
          <p>© 2023 Womanhood</p>
          <a href="/archive.html">Cookie Preferences</a>
          <a href="/archive.html">Privacy Policy</a>
        </div>

        <span className="site-footer__wordmark-clip">
          <span className="sr-only">WoManHood</span>
        </span>
      </footer>
    </>
  )
}

export default App
