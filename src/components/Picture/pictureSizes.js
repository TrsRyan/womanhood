// The site's layout breakpoints (index.css), in the max-width form that
// every browser understands inside `sizes`.
const MOBILE = '(max-width: 767px)'
const TABLET = '(max-width: 1023px)'

// How wide the browser must fetch the photo, per layout: the `sizes`
// attribute. `sizes` gives the frame's width in vw ({ mobile, tablet,
// desktop }), or 'viewport' for a photo covering the whole screen. A photo
// cropped to cover a frame of another shape (`frameRatio`, width / height)
// is drawn wider than the frame when it is the wider of the two; `scale`
// adds an animated zoom. Computed from the photo's own proportions, so it
// stays right when a photo is replaced. Shared by <Picture> and the
// preloads, so both ask the browser for the same file.
export function pictureSizes(image, sizes, frameRatio, scale = 1) {
  const imageRatio = image.img.w / image.img.h

  if (sizes === 'viewport') {
    const heightBound = `(max-aspect-ratio: ${image.img.w}/${image.img.h}) ${Math.ceil(100 * imageRatio * scale)}vh`
    return `${heightBound}, ${Math.ceil(100 * scale)}vw`
  }

  const crop = frameRatio && imageRatio > frameRatio ? imageRatio / frameRatio : 1
  const width = (vw) => `${Math.ceil(vw * crop * scale)}vw`
  return `${MOBILE} ${width(sizes.mobile)}, ${TABLET} ${width(sizes.tablet)}, ${width(sizes.desktop)}`
}
