import { useState } from 'react'
import useSound from '../../hooks/useSound.js'
import RollText from '../RollText/RollText.jsx'

// The sound setting's label, "(Sound On)" or "(Sound Off)", plus `suffix`.
// When the setting changes, the old label rolls out and the new one rolls
// in, with the hover's own roll (at once where there is no hover roll);
// once it lands, it settles as the label at rest. Each RollText is keyed by what it shows, so it splits that text
// afresh.
function SoundLabel({ suffix = '' }) {
  const [soundOn] = useSound()
  const label = `(Sound ${soundOn ? 'On' : 'Off'})${suffix}`
  const [settled, setSettled] = useState(label)

  if (settled === label) return <RollText key={label}>{label}</RollText>

  return (
    <RollText key={`${settled} > ${label}`} rollFrom={settled} onRollComplete={() => setSettled(label)}>
      {label}
    </RollText>
  )
}

export default SoundLabel
