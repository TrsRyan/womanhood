import './App.css'

const HERO_GRID_COLUMNS = 36

function App() {
  return (
    <>
      <header className="site-header">
        <a href="/" className="site-header__wordmark">WoManHood</a>
        <nav className="site-header__nav">
          <button type="button" className="site-header__sound-toggle">(Sound On),</button>
          <a href="/archive.html" className="site-header__archive-link">Archive</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__grid" aria-hidden="true">
            {Array.from({ length: HERO_GRID_COLUMNS }).map((_, index) => (
              <span key={index} className="hero__grid-column" />
            ))}
          </div>

          <div className="hero__tagline-row">
            <p className="hero__tagline">
              Three female characters searching for the fine line between Man and Woman. Blending fiction and reality, circus arts, music, and documentary.
            </p>
          </div>

          <span className="hero__title-clip">
            <h1 className="hero__title">WoManHood</h1>
          </span>
        </section>
      </main>
    </>
  )
}

export default App
