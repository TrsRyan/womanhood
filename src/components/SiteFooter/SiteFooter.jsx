import transitionImage from '../../assets/transition-image.jpg'
import { WORDMARK_HEIGHT, WORDMARK_LETTERS, WORDMARK_WIDTH } from './wordmark-letters.js'
import './SiteFooter.css'

const PHOTO_PATTERN_ID = 'site-footer-photo'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__legacy">
        <p>© 2023 Womanhood</p>
        <a href="/archive.html">Cookie Preferences</a>
        <a href="/archive.html">Privacy Policy</a>
      </div>

      {/* Each letter is drawn twice: filled with the photo, then in black
          on top. Hovering a letter fades its black copy out. The pattern
          spans the whole wordmark, so the letters share one photo. */}
      <svg className="site-footer__wordmark" viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} role="img" aria-label="WoManHood">
        <defs>
          <pattern id={PHOTO_PATTERN_ID} patternUnits="userSpaceOnUse" width={WORDMARK_WIDTH} height={WORDMARK_HEIGHT}>
            <image href={transitionImage} width={WORDMARK_WIDTH} height={WORDMARK_HEIGHT} preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>

        {WORDMARK_LETTERS.map(({ path }, index) => (
          <g key={index} className="site-footer__letter">
            <path d={path} fill={`url(#${PHOTO_PATTERN_ID})`} />
            <path className="site-footer__letter-ink" d={path} />
          </g>
        ))}
      </svg>
    </footer>
  )
}

export default SiteFooter
