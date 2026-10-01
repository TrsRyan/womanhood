import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './EnterScreen.css'

// Shown over the closed curtain on every full page load: "Loading" while
// the page is prepared behind it, then an "Enter" button. The click is
// also the gesture browsers require before a site may play sound.
// Rendered outside #root, which is inert meanwhile, so the button is the
// only thing focusable.
function EnterScreen({ ready, onEnter }) {
  const buttonRef = useRef(null)

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
        {ready ? 'Enter' : 'Loading'}
      </button>
    </div>,
    document.body,
  )
}

export default EnterScreen
