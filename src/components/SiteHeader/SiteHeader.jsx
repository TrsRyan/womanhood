import { Link } from 'react-router'
import useSound from '../../hooks/useSound.js'
import RollText from '../RollText/RollText.jsx'
import SoundLabel from '../SoundLabel/SoundLabel.jsx'
import './SiteHeader.css'

function SiteHeader() {
  const [, toggleSound] = useSound()

  return (
    <header className="site-header">
      <Link to="/" className="site-header__wordmark"><RollText>WoManHood</RollText></Link>
      <nav className="site-header__nav">
        <button type="button" className="site-header__sound-toggle" onClick={toggleSound}>
          <SoundLabel suffix="," />
        </button>
        <Link to="/archive" className="site-header__archive-link"><RollText>Archive</RollText></Link>
      </nav>
    </header>
  )
}

export default SiteHeader
