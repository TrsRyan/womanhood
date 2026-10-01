// Resolves once the visitor has gone through the enter screen, once per
// full page load. Animations of what is on screen at load wait for it,
// so they play when the site opens rather than behind the closed cover.
let resolveSiteOpen

export const siteOpen = new Promise((resolve) => {
  resolveSiteOpen = resolve
})

export function openSite() {
  resolveSiteOpen()
}
