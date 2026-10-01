import theChainAac from '../assets/audio/the-chain.m4a?url'
import theChainMp3 from '../assets/audio/the-chain.mp3?url'

// The site's music, one loop played for as long as the visit lasts, on
// the Web Audio API: its looping is sample-accurate, where an <audio>
// element leaves a gap at each turn.
//
// The file holds the loop with half a second of music on each side (the
// loop's end before it, its start after it). The encoder's padding falls
// in those margins, outside the loop, so looping between these marks is
// seamless whatever offset a browser's decoder adds.
const LOOP_START = 0.5
const LOOP_END = 0.5 + 2703017 / 44100

// Seconds.
const FADE_ENTER = 3
const FADE_TOGGLE = 0.6
const FADE_HIDDEN = 0.3

// Fades move evenly in decibels, the way hearing perceives loudness, from
// or down to this level, barely audible: the music rises softly from the
// very first instant instead of jumping in, as on a straight volume ramp.
const SILENCE_DB = -40
const FADE_STEPS = 32

const STORAGE_KEY = 'womanhood-sound'

// The music is the point of the site, so on iOS it plays like a music
// app's would: through the silent switch, pausing other audio (Apple's
// "playback" category). Must be set before the AudioContext exists.
if ('audioSession' in navigator) navigator.audioSession.type = 'playback'

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

let context
let gain
let buffer
let source
let loading
let pendingSuspend
let entered = false
let enabled = readPreference()
const listeners = new Set()

function getContext() {
  if (!context) {
    context = new AudioContext()
    gain = context.createGain()
    gain.gain.value = 0
    gain.connect(context.destination)
  }
  return context
}

// Fades from wherever the volume is, so a fade cut short by another never
// jumps. The decibel curve is laid out as short straight segments, which
// a later fade can cancel cleanly in every browser.
function fadeTo(value, duration) {
  const now = context.currentTime
  const from = gain.gain.value
  const toDb = (amplitude) => Math.max(SILENCE_DB, 20 * Math.log10(amplitude))
  const startDb = toDb(from)
  const endDb = toDb(value)

  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(from, now)

  for (let step = 1; step <= FADE_STEPS; step++) {
    const db = startDb + ((endDb - startDb) * step) / FADE_STEPS
    const amplitude = step === FADE_STEPS ? value : 10 ** (db / 20)
    gain.gain.linearRampToValueAtTime(amplitude, now + (duration * step) / FADE_STEPS)
  }
}

// A suspended context stops the clock too: the music picks up exactly
// where it was, and the device does no audio work meanwhile.
function suspendAfter(duration) {
  clearTimeout(pendingSuspend)
  pendingSuspend = setTimeout(() => context.suspend(), duration * 1000)
}

function play(duration) {
  if (!buffer) return

  clearTimeout(pendingSuspend)
  context.resume()

  if (!source) {
    source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.loopStart = LOOP_START
    source.loopEnd = LOOP_END
    source.connect(gain)
    source.start(0, LOOP_START)
  }

  fadeTo(1, duration)
}

function fadeOut(duration) {
  if (!source) return
  fadeTo(0, duration)
  suspendAfter(duration)
}

// Downloads and decodes the music, once. AAC first, MP3 if this browser
// can't decode AAC (some Linux builds of Firefox). The context is created
// suspended, which decoding doesn't need to be running for.
export function loadSoundtrack() {
  loading ??= (async () => {
    const audio = getContext()

    for (const url of [theChainAac, theChainMp3]) {
      try {
        const response = await fetch(url)
        buffer = await audio.decodeAudioData(await response.arrayBuffer())
        break
      } catch {
        // Try the next format; without any, the site stays silent.
      }
    }

    // Entered before the music was ready: it fades in now.
    if (entered && enabled) play(FADE_ENTER)
  })()

  return loading
}

// Call synchronously inside the Enter click: browsers only let a page
// start sound from within a user's gesture.
export function enterSoundtrack() {
  entered = true
  getContext().resume()
  if (enabled) play(FADE_ENTER)
}

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(on) {
  enabled = on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // Storage can be unavailable (private browsing); the choice then
    // lasts for this visit only.
  }
  listeners.forEach((listener) => listener())

  if (!entered) return
  if (on) play(FADE_TOGGLE)
  else fadeOut(FADE_TOGGLE)
}

export function subscribeToSound(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Hidden tab or app: the music pauses, and fades back in on return.
document.addEventListener('visibilitychange', () => {
  if (!entered || !enabled) return
  if (document.hidden) fadeOut(FADE_HIDDEN)
  else play(FADE_TOGGLE)
})

// iOS can leave the context "interrupted" after a call or an alarm, and
// only resumes it from a gesture: the next touch or click brings the
// music back.
document.addEventListener(
  'pointerdown',
  () => {
    if (entered && enabled && source && context.state !== 'running') play(FADE_TOGGLE)
  },
  { passive: true },
)
