import { Fragment } from 'react'
import GridOverlay from './components/GridOverlay/GridOverlay.jsx'
import SiteHeader from './components/SiteHeader/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter/SiteFooter.jsx'
import './LegalPage.css'

// Archive's layout with only its credit and chapter columns: the page
// title where Archive has its credit, the text where its chapters start.
function LegalPage({ title, intro, sections }) {
  return (
    <>
      <GridOverlay />

      <SiteHeader />

      <main className="legal">
        <div className="legal__container">
          <h1 className="legal__title">{title}</h1>

          <div className="legal__content">
            {intro && <p>{intro}</p>}

            {sections.map(({ heading, body }) => (
              <Fragment key={heading}>
                <h2 className="legal__heading">{heading}</h2>
                <p>{body}</p>
              </Fragment>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

export default LegalPage
