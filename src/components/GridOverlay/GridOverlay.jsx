import './GridOverlay.css'

// Desktop column count; the smaller breakpoints hide lines in CSS.
const SITE_GRID_COLUMNS = 36

function GridOverlay() {
  return (
    <div className="grid-overlay" aria-hidden="true">
      {Array.from({ length: SITE_GRID_COLUMNS }).map((_, index) => (
        <span key={index} className="grid-overlay__line" />
      ))}
    </div>
  )
}

export default GridOverlay
