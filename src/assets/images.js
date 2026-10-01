// Every photo in this folder, by file name without its extension (e.g.
// images['intro-primary']): its <picture> sources and its placeholder,
// generated at build time (see vite.config.js). Only the URLs end up in
// the bundle, never the image bytes.
const pictures = import.meta.glob('./*.{jpg,png}', { query: '?picture', import: 'default', eager: true })
const placeholders = import.meta.glob('./*.{jpg,png}', { query: '?placeholder', import: 'default', eager: true })

const images = Object.fromEntries(
  Object.keys(pictures).map((path) => [
    path.replace(/^\.\/(.+)\.\w+$/, '$1'),
    { ...pictures[path], placeholder: placeholders[path] },
  ]),
)

export default images
