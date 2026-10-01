import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import GridOverlay from './components/GridOverlay/GridOverlay.jsx'
import SiteHeader from './components/SiteHeader/SiteHeader.jsx'
import RollText from './components/RollText/RollText.jsx'
import SiteFooter from './components/SiteFooter/SiteFooter.jsx'
import useTextReveal from './hooks/useTextReveal.js'
import { createTextReveal } from './animation/textReveal.js'
import './App.css'
import Picture from './components/Picture/Picture.jsx'
import images from './assets/images.js'
import { HOME_LEAD_PICTURE } from './pages.js'

// The 3:4 frames most photos are cropped to (aspect-ratio in App.css).
const PORTRAIT_FRAME = 3 / 4

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
// Seconds between the left question's reveal and the right one's.
const PIN_GALLERY_QUESTION_BEAT = 0.25
// End state of the last image's morph, defined in App.css.
const FULLSCREEN_CLASS = 'pin-gallery__item--fullscreen'

gsap.registerPlugin(ScrollTrigger, Flip)

function App() {
  const mainRef = useRef(null)
  const transitionImageRef = useRef(null)
  const heroRef = useRef(null)
  const transitionSpacerRef = useRef(null)
  const narrativeHeaderRef = useRef(null)
  const narrativeContentRef = useRef(null)
  const pinGalleryRef = useRef(null)
  const pinGalleryStageRef = useRef(null)

  useTextReveal(mainRef)

  useGSAP(() => {
    // One timeline over the hero + spacer window: the parallax (yPercent)
    // runs throughout, the dezoom and the fade to the black backdrop only
    // near the end. While they overlap, scale must stay >= 1 +
    // |yPercent| / 50, or the image no longer covers the viewport and
    // an edge shows. autoAlpha also sets visibility:hidden once the fade
    // is over, so the browser stops rendering the image.
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
      .fromTo(transitionImageRef.current, { scale: HOME_LEAD_PICTURE.scale }, { scale: 1.18, ease: 'none', duration: 0.4 }, 0.8)
      .fromTo(transitionImageRef.current, { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.4 }, 0.8)
  })

  // Declared after the block above so its ScrollTrigger is created after
  // the transition image's: ScrollTriggers must be created in page order
  // (top to bottom) to refresh correctly.
  useGSAP((context, contextSafe) => {
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

    // The travel distance and Flip's grid state are both in pixels, so the
    // timeline is rebuilt whenever the stage itself changes size (GSAP's
    // recommended fix for Flip + resize). Only the tweens are rebuilt,
    // never the pin, so the page never jumps. The stage is 100lvh, which
    // ignores the mobile browser toolbar, so toolbar show/hide never
    // triggers a rebuild mid-scroll.
    let measuredSize = ''

    // The lead is split by its scroll reveal (useTextReveal), once the
    // fonts are in: its words are read at each build, and every split
    // fires `textsplit`, which rebuilds the timeline onto them. The gray
    // and black come from the site's tokens rather than being repeated
    // here; the lead's own CSS color stays black, so the text still reads
    // if the script never runs.
    const lead = pinGalleryRef.current.querySelector('.pin-gallery__lead')
    const leadGray = getComputedStyle(document.documentElement).getPropertyValue('--gray-text').trim()
    const leadBlack = getComputedStyle(lead).color

    const stageSize = () => `${stage.offsetWidth}x${stage.offsetHeight}`

    const buildTimeline = contextSafe(() => {
      measuredSize = stageSize()

      const time = pinGalleryTimeline.time()
      pinGalleryTimeline.clear()
      lastItem.classList.remove(FULLSCREEN_CLASS)
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
        // item grows into its fullscreen state. Flip records the grid
        // position, the class switches the item to the stage-covering
        // layout, and Flip.from animates between the two. At the end Flip
        // clears its inline values, so CSS alone sizes the final frame.
        const settleDuration = imageLifetime / 2
        const gridState = Flip.getState(lastItem)
        lastItem.classList.add(FULLSCREEN_CLASS)

        pinGalleryTimeline
          .fromTo(image, { y: travel }, { y: 0, ease: PIN_GALLERY_EASE, duration: settleDuration }, start)
          .add(
            Flip.from(gridState, { ease: PIN_GALLERY_EASE, duration: 2.5 }),
            start + settleDuration + PIN_GALLERY_HOLD,
          )
      })

      // The lead fills in word by word, karaoke style, and is fully black
      // by the time the last image starts rising towards it. Linear ease,
      // so the fill tracks the scroll exactly.
      const lastImageStart = (images.length - 1) * (imageLifetime - PIN_GALLERY_OVERLAP)

      pinGalleryTimeline.fromTo(
        gsap.utils.toArray('.text-reveal__word', lead),
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
      // Events stay on: Flip's final cleanup is a callback, skipped if the
      // jump suppressed it. The questions don't replay, since both jumps
      // land in the same tick and their handler only acts on a change.
      pinGalleryTimeline.time(0).time(time)
    })

    // The questions get the site's text reveal, played on their own clock
    // rather than the scroll: forward once the playhead passes the end of
    // the morph, the left one first and the right one a beat later, and
    // backwards, both at once, when it goes back past it.
    const questionReveals = gsap.utils.toArray('.pin-gallery__question', pinGalleryRef.current).map(createTextReveal)
    let questionsShown = false
    let questionDelays = []

    pinGalleryTimeline.eventCallback('onUpdate', () => {
      const shown = pinGalleryTimeline.time() >= pinGalleryTimeline.labels.questions
      if (shown === questionsShown) return

      questionsShown = shown
      questionDelays.forEach((delay) => delay.kill())
      questionDelays = shown
        ? questionReveals.map((reveal, index) => gsap.delayedCall(index * PIN_GALLERY_QUESTION_BEAT, reveal.play))
        : []
      if (!shown) questionReveals.forEach((reveal) => reveal.reverse())
    })

    buildTimeline()

    const stageObserver = new ResizeObserver(() => {
      if (stageSize() !== measuredSize) buildTimeline()
    })
    stageObserver.observe(stage)
    lead.addEventListener('textsplit', buildTimeline)

    return () => {
      stageObserver.disconnect()
      lead.removeEventListener('textsplit', buildTimeline)
      questionDelays.forEach((delay) => delay.kill())
      questionReveals.forEach((reveal) => reveal.kill())
    }
  }, { scope: pinGalleryRef })

  // CSS has no access to the content's rendered height, which changes with
  // the line count; .narrative__header needs it to end its sticky travel.
  useEffect(() => {
    const header = narrativeHeaderRef.current
    const contentObserver = new ResizeObserver(([entry]) => {
      header.style.setProperty('--narrative-content-height', `${entry.borderBoxSize[0].blockSize}px`)
    })
    contentObserver.observe(narrativeContentRef.current)

    return () => contentObserver.disconnect()
  }, [])

  return (
    <>
      <GridOverlay />

      <SiteHeader />

      <main ref={mainRef}>
        <div className="transition-scene">
          <div className="transition-image__backdrop" aria-hidden="true" />

          <Picture className="transition-image__img" {...HOME_LEAD_PICTURE} priority ref={transitionImageRef} />

          <section className="hero" ref={heroRef}>
            <div className="hero__tagline-row">
              <p className="hero__tagline" data-text-reveal>
                Three female characters searching for the fine line between Man and Woman. Blending fiction and reality, circus arts, music, and documentary.
              </p>
            </div>

            <span className="hero__title-clip">
              <span className="sr-only">WoManHood</span>
            </span>
          </section>

          <div className="transition-image__spacer" aria-hidden="true" ref={transitionSpacerRef} />
        </div>

        <div className="page-content">
          <section className="intro">
            <div className="intro__media">
              <Picture
                className="intro__image intro__image--primary"
                image={images['intro-primary']}
                sizes={{ mobile: 100, tablet: 50, desktop: 34 }}
                frameRatio={PORTRAIT_FRAME}
              />
              <Picture
                className="intro__image intro__image--secondary"
                image={images['intro-secondary']}
                sizes={{ mobile: 50, tablet: 25, desktop: 17 }}
                frameRatio={PORTRAIT_FRAME}
              />
              <p className="intro__copyright" data-text-reveal>©2023</p>
            </div>

            <div className="intro__text">
              <p className="intro__index-label" data-text-reveal>(01)</p>
              <p className="intro__paragraph intro__paragraph--first" data-text-reveal>
                WoManHood starts from something real. In the mountains of northern Albania, a family left without sons could turn to a daughter. She swore an oath of virginity and lived as a man from then on.
              </p>
              <p className="intro__paragraph intro__paragraph--second" data-text-reveal>
                They are called Burnesha, from the Albanian for &quot;like a man&quot;, and are often described as the last women in Europe to live as men. The tradition is fading. The inequality that produced it has not.
              </p>
            </div>
          </section>

          <section className="narrative">
            <Picture
              className="narrative__background"
              image={images['narrative-background']}
              sizes={{ mobile: 100, tablet: 100, desktop: 100 }}
            />

            <div className="narrative__header" ref={narrativeHeaderRef}>
              <div className="narrative__content" ref={narrativeContentRef}>
                <p className="narrative__index-label" data-text-reveal>(02)</p>
                <p className="narrative__title" data-text-reveal>From real life to the imaginary</p>
                <p className="narrative__description" data-text-reveal>
                  A black box, almost no set. Aerial chain, contortion, live voice, autoharp and electronic effects play against documentary footage projected onto the stage, until it is no longer clear what is filmed and what is live.
                </p>
              </div>
            </div>
          </section>

          <section className="documentary">
            <p className="documentary__index-label" data-text-reveal>(03)</p>

            <Picture
              className="documentary__image documentary__image--cover"
              image={images['documentary-cover']}
              sizes={{ mobile: 50, tablet: 17, desktop: 17 }}
              frameRatio={PORTRAIT_FRAME}
            />

            <p className="documentary__note" data-text-reveal>
              Sound, spoken word, live interviews. Everything was gathered on location.
            </p>

            <p className="documentary__caption" data-text-reveal>Documentary, Albania</p>

            <div className="documentary__quote">
              <p className="documentary__quote-text" data-text-reveal>
                In 2014, while researching masculinity for the stage, Mille Lundt came across photographs of the Burnesha and never let the subject go. Years later the company went to find them: one in the northern mountains, another by the sea in Durrës.
              </p>
              <Link className="documentary__quote-link" to="/archive" data-text-reveal><RollText underline>Read The Story</RollText></Link>
            </div>

            <Picture
              className="documentary__image documentary__image--feature"
              image={images['documentary-feature']}
              sizes={{ mobile: 100, tablet: 25, desktop: 34 }}
              frameRatio={PORTRAIT_FRAME}
            />
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
              <p className="pin-gallery__lead" data-text-reveal>
                Combining performance, circus arts, visual art, sound, and photography to push artistic boundaries.
              </p>

              <div className="pin-gallery__images">
                {/* Eager: they start at scale 0, an empty box that lazy
                    loading would never see entering the screen. The last
                    one ends up covering the whole stage. */}
                {['pin-gallery-1', 'pin-gallery-2', 'pin-gallery-3'].map((name, index) => (
                  <figure key={name} className={`pin-gallery__item pin-gallery__item--${index + 1}`}>
                    <Picture
                      className="pin-gallery__image"
                      image={images[name]}
                      sizes={{ mobile: 50, tablet: 25, desktop: 17 }}
                      frameRatio={PORTRAIT_FRAME}
                      eager
                    />
                  </figure>
                ))}
                <figure className="pin-gallery__item pin-gallery__item--4">
                  <Picture className="pin-gallery__image" image={images['pin-gallery-4']} sizes="viewport" eager />
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

      <SiteFooter />
    </>
  )
}

export default App
