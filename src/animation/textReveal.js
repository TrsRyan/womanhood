import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText)

// A re-split that changes a text's height moves everything below it, so
// ScrollTrigger must measure the page again. One refresh for every text
// re-split in the same moment (a resize re-splits many at once).
let pendingRefresh
function requestRefresh() {
  pendingRefresh?.kill()
  pendingRefresh = gsap.delayedCall(0.1, () => ScrollTrigger.refresh())
}

// Each line's letters rise from just below it one after another, so a
// wave runs along every line; each line's wave sets off a beat after the
// one above. The ease covers most of the distance at once, so the text is
// readable almost immediately and the rest of the duration is a long,
// soft settle.
const REVEAL_EASE = CustomEase.create('reveal', '0.17, 0.84, 0.44, 1')
const REVEAL_DURATION = 1.2
const CHAR_STAGGER = 0.005
const LINE_STAGGER = 0.08
// Each letter fades in on its own, shorter tween: it is fully opaque while
// still rising, so the fade only softens the mask's hard edge and never
// hides the wave.
const FADE_EASE = 'power1.out'
const FADE_DURATION = 1

// Geist's ligatures (checked in the font file): pairs drawn as one glyph.
// Each stays a single letter of the split, so the glyph survives; longest
// first, as the font matches them (ffi is ff + i).
const LIGATURES = ['ff', 'fi', 'fl', 'tt', '->', '<-']

// Every style that changes how wide a run of text sets.
const TEXT_METRIC_STYLES = [
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'font-stretch',
  'font-variation-settings',
  'font-feature-settings',
  'font-variant-ligatures',
  'font-kerning',
  'letter-spacing',
  'word-spacing',
  'text-transform',
  'text-rendering',
]

// Safari's Range measurements aren't reliable for this; Griffo measures
// element boxes there instead, and so does this.
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// A letter alone in its own box loses the font's kerning. A pair's kerning
// is the pair's width minus each letter's own width, measured on a hidden
// copy of the text's font settings, away from the layout (the method of
// Griffo, a kerning-aware splitting library). One meter per text style,
// kept for the whole visit with its widths: texts set alike share their
// measurements, and the same pairs come back across every text.
const kerningMeters = new Map()

function getKerningMeter(styleSource) {
  const styles = getComputedStyle(styleSource)
  const key = TEXT_METRIC_STYLES.map((property) => styles.getPropertyValue(property)).join('|')
  if (!kerningMeters.has(key)) kerningMeters.set(key, createKerningMeter(styles))
  return kerningMeters.get(key)
}

function createKerningMeter(styles) {
  const meter = document.createElement('span')
  TEXT_METRIC_STYLES.forEach((property) => meter.style.setProperty(property, styles.getPropertyValue(property)))
  meter.style.cssText += 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;white-space:pre;'
  document.body.append(meter)
  console.log('[kerning] meter created', Math.round(performance.now()) + 'ms', 'font loaded:', document.fonts.check('1em "Geist Variable"'), 'fonts status:', document.fonts.status, 'size:', styles.fontSize)

  const range = document.createRange()
  const widths = new Map()
  const width = (text) => {
    if (!widths.has(text)) {
      meter.textContent = text
      if (isSafari) {
        widths.set(text, meter.getBoundingClientRect().width)
      } else {
        range.selectNodeContents(meter.firstChild)
        widths.set(text, range.getBoundingClientRect().width)
      }
    }
    return widths.get(text)
  }

  return {
    fontSize: parseFloat(styles.fontSize),
    kerning: (...parts) => {
      const kerning = width(parts.join('')) - parts.reduce((sum, part) => sum + width(part), 0)
      if (Math.abs(kerning / parseFloat(styles.fontSize)) > 0.08) {
        console.log('[kerning] odd pair', JSON.stringify(parts.join('')), 'kerning px:', kerning.toFixed(2), 'widths:', parts.map((part) => `${JSON.stringify(part)}=${width(part).toFixed(2)}`).join(' '), 'whole:', width(parts.join('')).toFixed(2), 'at', Math.round(performance.now()) + 'ms', 'font loaded now:', document.fonts.check('1em "Geist Variable"'))
      }
      return kerning
    },
  }
}

// Puts kerning back as a left margin on the second letter of each pair, in
// em so it follows the text size; across a space too, between the last
// letter of a word and the first of the next one on the same line. All
// measuring first, then all writing.
function restoreKerning(lines, words) {
  if (!words.length) return
  const meter = getKerningMeter(words[0])
  const margins = new Map()

  words.forEach((word, index) => {
    const letters = [...word.children]
    letters.slice(1).forEach((letter, i) => {
      margins.set(letter, meter.kerning(letters[i].textContent, letter.textContent))
    })

    const previous = words[index - 1]
    if (previous && lines.some((line) => line.contains(previous) && line.contains(word))) {
      margins.set(letters[0], meter.kerning(previous.lastElementChild.textContent, ' ', letters[0].textContent))
    }
  })

  margins.forEach((kerning, letter) => {
    if (Math.abs(kerning) > 1e-3) letter.style.marginLeft = `${kerning / meter.fontSize}em`
  })
}

// The wave over `lineChars` (one array of letters per line), paused, its
// letters parked below their lines.
function createWave(lineChars) {
  const wave = gsap.timeline({ paused: true })

  lineChars.forEach((chars, index) => {
    wave
      .fromTo(
        chars,
        { yPercent: 110 },
        { yPercent: 0, ease: REVEAL_EASE, duration: REVEAL_DURATION, stagger: CHAR_STAGGER },
        index * LINE_STAGGER,
      )
      .fromTo(
        chars,
        { opacity: 0 },
        { opacity: 1, ease: FADE_EASE, duration: FADE_DURATION, stagger: CHAR_STAGGER },
        index * LINE_STAGGER,
      )
  })

  return wave
}

// Prepares `element` for the site's text reveal: a wave of letters rising
// into their lines through a mask, and fading in. The text stays hidden
// until then. Returns the controls; when to play is the caller's choice
// (scroll, a timeline moment...). Call it inside a GSAP context so the
// split and the wave are cleaned up with it, and call `kill()` on cleanup
// for the resize listener.
//
// - A RollText label is already split into letters and masked by its own
//   line; those letters are revealed as they are, never split again.
// - data-text-revealed is set on the element once the reveal has
//   finished, and removed as soon as it rewinds or reverses (RollText's
//   hover waits for it, since both move the same letters).
// - A `textsplit` event fires on the element after every split, for code
//   that animates the same words (the pin-gallery lead).
export function createTextReveal(element) {
  let wave
  let split
  let splitHeight
  let resizeTimer
  let removeResizeListener
  let direction = 'paused'

  const finishWave = () => {
    wave.eventCallback('onComplete', () => element.setAttribute('data-text-revealed', ''))
    if (direction === 'forward') wave.play()
    if (direction === 'backward') wave.reverse()

    // The letters are now parked below their lines: the text can be
    // shown without flashing (see [data-text-reveal] in index.css).
    gsap.set(element, { visibility: 'visible' })
    return wave
  }

  const rollChars = gsap.utils.toArray('.roll-text__char', element)

  if (rollChars.length) {
    wave = createWave([rollChars])

    // An underline draws in from the left and fades in along with the
    // letters, then hands its transform-origin back to RollText's wipe.
    const underline = element.querySelector('.roll-text__underline')
    if (underline) {
      wave
        .fromTo(
          underline,
          { scaleX: 0, transformOrigin: 'left' },
          {
            scaleX: 1,
            transformOrigin: 'left',
            ease: REVEAL_EASE,
            duration: REVEAL_DURATION,
            clearProps: 'transformOrigin',
          },
          0,
        )
        .fromTo(underline, { opacity: 0 }, { opacity: 1, ease: FADE_EASE, duration: FADE_DURATION }, 0)
    }

    finishWave()
  } else {
    // Lines and words first: words are still whole, so the lines break
    // exactly as the text does unsplit. Then the letters, inside each
    // word, put back where kerning had them: the split text matches the
    // original to the pixel, and is never reverted, so nothing ever jumps.
    // autoSplit re-splits once fonts load and whenever the width changes.
    // The wave is rebuilt on each split; returning it lets SplitText carry
    // its progress over, and `direction` keeps it moving the way it was.
    split = SplitText.create(element, {
      type: 'lines, words',
      mask: 'lines',
      linesClass: 'text-reveal__line',
      wordsClass: 'text-reveal__word',
      autoSplit: true,
      onSplit: ({ lines, words }) => {
        const height = element.offsetHeight
        if (splitHeight !== undefined && height !== splitHeight) requestRefresh()
        splitHeight = height

        const { chars } = SplitText.create(words, {
          type: 'chars',
          charsClass: 'text-reveal__char',
          specialChars: LIGATURES,
          aria: 'none',
        })
        restoreKerning(lines, words)

        wave = createWave(lines.map((line) => chars.filter((char) => line.contains(char))))
        element.dispatchEvent(new Event('textsplit'))
        return finishWave()
      },
    })

    // autoSplit only watches the width, but fluid type can grow inside a
    // capped width (above 1512px), which reflows the text just the same.
    let fontSize = getComputedStyle(element).fontSize
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const newFontSize = getComputedStyle(element).fontSize
        if (newFontSize === fontSize) return
        fontSize = newFontSize
        split.split()
      }, 200)
    }
    window.addEventListener('resize', onResize)
    removeResizeListener = () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }

  return {
    kill() {
      removeResizeListener?.()
    },
    play() {
      direction = 'forward'
      wave.play()
    },
    reverse() {
      direction = 'backward'
      element.removeAttribute('data-text-revealed')
      wave.reverse()
    },
    rewind() {
      direction = 'paused'
      element.removeAttribute('data-text-revealed')
      wave.pause(0)
    },
  }
}
