import './Picture.css'

// The site's layout breakpoints (index.css), in the max-width form that
// every browser understands inside `sizes`.
const MOBILE = '(max-width: 767px)'
const TABLET = '(max-width: 1023px)'

// How wide the browser must fetch the photo, per layout. `sizes` gives the
// frame's width in vw ({ mobile, tablet, desktop }), or 'viewport' for a
// photo covering the whole screen. A photo cropped to cover a frame of
// another shape (`frameRatio`, width / height) is drawn wider than the
// frame when it is the wider of the two; `scale` adds an animated zoom.
// Computed from the photo's own proportions, so it stays right when a
// photo is replaced.
function buildSizes(image, sizes, frameRatio, scale) {
  const imageRatio = image.img.w / image.img.h

  if (sizes === 'viewport') {
    const heightBound = `(max-aspect-ratio: ${image.img.w}/${image.img.h}) ${Math.ceil(100 * imageRatio * scale)}vh`
    return `${heightBound}, ${Math.ceil(100 * scale)}vw`
  }

  const crop = frameRatio && imageRatio > frameRatio ? imageRatio / frameRatio : 1
  const width = (vw) => `${Math.ceil(vw * crop * scale)}vw`
  return `${MOBILE} ${width(sizes.mobile)}, ${TABLET} ${width(sizes.tablet)}, ${width(sizes.desktop)}`
}

// Clears the placeholder once the photo is drawn, so it never shows
// around a transparent photo's edges.
const clearPlaceholder = (event) => {
  event.currentTarget.style.backgroundImage = 'none'
}

// Every photo of the site goes through this: AVIF, then WebP, then the
// fallback, each at the width the layout needs, over a blurred
// placeholder. The <picture> wrapper is display: contents (Picture.css),
// so the <img> lays out exactly as if it stood alone; className and ref
// go to the <img>. `priority` is for the photo on screen at load (fetched
// first, never lazy); `eager` for photos an animation brings in faster
// than lazy loading would fetch them.
function Picture({ image, sizes, frameRatio, scale = 1, alt = '', priority = false, eager = false, className, ref }) {
  const sizesAttribute = buildSizes(image, sizes, frameRatio, scale)
  const { avif, webp, ...fallback } = image.sources

  return (
    <picture className="picture">
      <source type="image/avif" srcSet={avif} sizes={sizesAttribute} />
      <source type="image/webp" srcSet={webp} sizes={sizesAttribute} />
      <img
        ref={ref}
        className={className}
        src={image.img.src}
        srcSet={Object.values(fallback)[0]}
        sizes={sizesAttribute}
        width={image.img.w}
        height={image.img.h}
        alt={alt}
        loading={priority || eager ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : eager ? 'low' : 'auto'}
        decoding="async"
        style={{ backgroundImage: `url(${image.placeholder})` }}
        onLoad={clearPlaceholder}
      />
    </picture>
  )
}

export default Picture
