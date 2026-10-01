import { useSyncExternalStore } from 'react'
import { isSoundEnabled, setSoundEnabled, subscribeToSound } from '../audio/soundtrack.js'

// The visitor's sound setting, shared by every control showing it (the
// enter screen, the header): [enabled, toggle].
function useSound() {
  const enabled = useSyncExternalStore(subscribeToSound, isSoundEnabled)
  return [enabled, () => setSoundEnabled(!enabled)]
}

export default useSound
