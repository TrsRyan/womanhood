import { pictureSizes } from './pictureSizes.js'
import './Picture.css'

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
// than lazy loading would fetch them. `reveal` gives the photo the site's
// image entrance (useImageReveal).
function Picture({
  image,
  sizes,
  frameRatio,
  scale = 1,
  alt = '',
  priority = false,
  eager = false,
  reveal = false,
  className,
  ref,
}) {
  const sizesAttribute = pictureSizes(image, sizes, frameRatio, scale)
  const { avif, webp, ...fallback } = image.sources

  return (
    <picture className="picture">
      <source type="image/avif" srcSet={avif} sizes={sizesAttribute} />
      <source type="image/webp" srcSet={webp} sizes={sizesAttribute} />
      <img
        ref={ref}
        className={className}
        data-image-reveal={reveal ? '' : undefined}
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
