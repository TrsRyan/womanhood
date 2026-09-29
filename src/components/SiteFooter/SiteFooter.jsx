import './SiteFooter.css'

function SiteFooter() {
  return (
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
  )
}

export default SiteFooter
