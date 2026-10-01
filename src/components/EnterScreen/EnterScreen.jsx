import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import useSound from '../../hooks/useSound.js'
import RollText from '../RollText/RollText.jsx'
import SoundLabel from '../SoundLabel/SoundLabel.jsx'
import './EnterScreen.css'

// Shown over the closed curtain on every full page load: "Loading" while
// the page is prepared behind it, then an "Enter" button. Next to it, the
// sound setting the visit will start with, stated before anything plays
// and switchable here: the same setting as the header's. The click on
// Enter is also the gesture browsers require before a site may play
// sound. Rendered outside #root, which is inert meanwhile, so these are
// the only focusable controls.
function EnterScreen({ ready, onEnter }) {
  const buttonRef = useRef(null)
  const [, toggleSound] = useSound()

  useEffect(() => {
    if (ready) buttonRef.current.focus()
  }, [ready])

  return createPortal(
    <div className="enter-screen">
      <button
        ref={buttonRef}
        type="button"
        className="enter-screen__button"
        disabled={!ready}
        onClick={onEnter}
      >
        {ready ? <RollText>Enter</RollText> : 'Loading'}
      </button>
      <button type="button" className="enter-screen__sound" onClick={toggleSound}>
        <SoundLabel />
      </button>
    </div>,
    document.body,
  )
}

export default EnterScreen
