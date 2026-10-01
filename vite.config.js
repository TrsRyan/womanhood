import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// Widths generated for every photo; any wider than the source is dropped,
// so a photo is never upscaled.
const PICTURE_WIDTHS = '640;960;1280;1920;2560;3200'

// Two queries cover every photo of the site, so a photo is just a file
// dropped into src/assets:
// - ?picture: AVIF and WebP at every width, plus a fallback in the
//   source's own kind (PNG if it can be transparent, JPEG otherwise), as
//   the sources of a <picture> element.
// - ?placeholder: a tiny inlined WebP shown, blurred by its upscaling,
//   until the photo itself arrives.
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: async (url, metadata) => {
        if (url.searchParams.has('picture')) {
          const fallback = (await metadata()).hasAlpha ? 'png' : 'jpg'
          return new URLSearchParams({ format: `avif;webp;${fallback}`, w: PICTURE_WIDTHS, as: 'picture' })
        }

        if (url.searchParams.has('placeholder')) {
          return new URLSearchParams({ w: '24', format: 'webp', quality: '60', inline: '' })
        }

        return new URLSearchParams()
      },
    }),
  ],
})
