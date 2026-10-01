import { useRef } from 'react'
import { Link } from 'react-router'
import RollText from './components/RollText/RollText.jsx'
import useTextReveal from './hooks/useTextReveal.js'
import './NotFound.css'

// Any address the site doesn't have: black like the intro, one message
// in the middle, and the way back home. Shown at once, without the intro
// (PageTransition), so the way home is a full load: the intro then plays
// from the same black, and its Enter is the click the music needs.
function NotFound() {
  const mainRef = useRef(null)
  useTextReveal(mainRef)

  return (
    <main className="not-found" ref={mainRef}>
      <p data-text-reveal>(404)</p>
      <h1 data-text-reveal>This page doesn’t exist.</h1>
      <Link to="/" reloadDocument className="not-found__link" data-text-reveal>
        <RollText underline>Back to home</RollText>
      </Link>
    </main>
  )
}

export default NotFound
