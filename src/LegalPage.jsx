import GridOverlay from './components/GridOverlay/GridOverlay.jsx'
import SiteHeader from './components/SiteHeader/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter/SiteFooter.jsx'
import './LegalPage.css'

// Archive's layout reduced to its two reading columns: the page title
// where Archive has its nav, the sections where it has its chapters.
function LegalPage({ title, sections }) {
  return (
    <>
      <GridOverlay />

      <SiteHeader />

      <main className="legal">
        <div className="legal__container">
          <h1 className="legal__title">{title}</h1>

          <div className="legal__content">
            {sections.map(({ heading, paragraphs }, index) => (
              <section className="legal__section" key={heading ?? index}>
                {heading && (
                  <header className="legal__section-header">
                    <h2 className="legal__section-title">{heading}</h2>
                  </header>
                )}

                <div className="legal__section-body">
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      className={`legal__paragraph${paragraphIndex === 0 ? ' legal__paragraph--first' : ''}`}
                      key={paragraphIndex}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

export default LegalPage
