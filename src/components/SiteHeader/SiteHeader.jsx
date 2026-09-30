import RollText from '../RollText/RollText.jsx'
import './SiteHeader.css'

function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" className="site-header__wordmark"><RollText>WoManHood</RollText></a>
      <nav className="site-header__nav">
        <button type="button" className="site-header__sound-toggle"><RollText>(Sound On),</RollText></button>
        <a href="/archive.html" className="site-header__archive-link"><RollText>Archive</RollText></a>
      </nav>
    </header>
  )
}

export default SiteHeader
