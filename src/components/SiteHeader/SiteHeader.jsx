import './SiteHeader.css'

function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" className="site-header__wordmark">WoManHood</a>
      <nav className="site-header__nav">
        <button type="button" className="site-header__sound-toggle">(Sound On),</button>
        <a href="/archive.html" className="site-header__archive-link">Archive</a>
      </nav>
    </header>
  )
}

export default SiteHeader
