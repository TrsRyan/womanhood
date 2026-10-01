import { Link } from 'react-router'
import useSound from '../../hooks/useSound.js'
import RollText from '../RollText/RollText.jsx'
import './SiteHeader.css'

function SiteHeader() {
  const [soundOn, toggleSound] = useSound()

  return (
    <header className="site-header">
      <Link to="/" className="site-header__wordmark"><RollText>WoManHood</RollText></Link>
      <nav className="site-header__nav">
        {/* Keyed by the label, so the letter roll re-splits the new text. */}
        <button type="button" className="site-header__sound-toggle" onClick={toggleSound}>
          <RollText key={soundOn ? 'on' : 'off'}>{soundOn ? '(Sound On),' : '(Sound Off),'}</RollText>
        </button>
        <Link to="/archive" className="site-header__archive-link"><RollText>Archive</RollText></Link>
      </nav>
    </header>
  )
}

export default SiteHeader
