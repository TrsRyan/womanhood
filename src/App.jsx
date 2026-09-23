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

function App() {
  return (
    <>
      <div className="grid-overlay" aria-hidden="true">
        {Array.from({ length: SITE_GRID_COLUMNS }).map((_, index) => (
          <span key={index} className="grid-overlay__line" />
        ))}
      </div>

      <header className="site-header">
        <a href="/" className="site-header__wordmark">WoManHood</a>
        <nav className="site-header__nav">
          <button type="button" className="site-header__sound-toggle">(Sound On),</button>
          <a href="/archive.html" className="site-header__archive-link">Archive</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__tagline-row">
            <p className="hero__tagline">
              Three female characters searching for the fine line between Man and Woman. Blending fiction and reality, circus arts, music, and documentary.
            </p>
          </div>

          <span className="hero__title-clip">
            <span className="sr-only">WoManHood</span>
          </span>
        </section>

        <img className="transition-image__img" src={transitionImage} alt="" />

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

        {/* Static structure only, matching the Figma annotation exactly so
            a later GSAP pin+scrub timeline can hook straight into it:
            .pin-gallery__stage is the element that gets pinned; the 4
            images share grid-row 1 (deliberately overlapping -- the
            timeline shows one at a time later); .pin-gallery__questions
            is a sibling of the images, never nested inside one (image 4
            scales via transform and a nested child would scale with it).
            No pin/scroll-height/scale-opacity setup here -- that's the
            animation phase. */}
        <section className="pin-gallery">
          <div className="pin-gallery__stage">
            <p className="pin-gallery__lead">
              Combining performance, circus arts, visual art, sound, and photography to push artistic boundaries.
            </p>

            <div className="pin-gallery__images">
              <img className="pin-gallery__image pin-gallery__image--1" src={pinGallery1} alt="" />
              <img className="pin-gallery__image pin-gallery__image--2" src={pinGallery2} alt="" />
              <img className="pin-gallery__image pin-gallery__image--3" src={pinGallery3} alt="" />
              <img className="pin-gallery__image pin-gallery__image--4" src={pinGallery4} alt="" />
            </div>

            <div className="pin-gallery__questions">
              <p className="pin-gallery__question pin-gallery__question--left">What is it to be a woman ?</p>
              <p className="pin-gallery__question pin-gallery__question--right">Why is it not enough to be a woman ?</p>
            </div>
          </div>
        </section>
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
