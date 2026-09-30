import { Link } from 'react-router'
import RollText from '../RollText/RollText.jsx'
import './SiteHeader.css'

function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__wordmark"><RollText>WoManHood</RollText></Link>
      <nav className="site-header__nav">
        <button type="button" className="site-header__sound-toggle"><RollText>(Sound On),</RollText></button>
        <Link to="/archive" className="site-header__archive-link"><RollText>Archive</RollText></Link>
      </nav>
    </header>
  )
}

export default SiteHeader
