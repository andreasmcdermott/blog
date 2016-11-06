/* eslint-env browser */

const a = document.createElement('a')
const urlCache = {}

export default function parseUrl(url) {
  if (!urlCache[url]) {
    a.href = url
    let origin = a.origin
    if (a.origin) {
      const host = a.host.replace(/:(80|443)$/, '')
      origin = `${a.protocol}//${host}`
    }
    const pathname = a.pathname.startsWith('/') ? a.pathname : `/${a.pathname}`
    urlCache[url] = {
      href: a.href,
      hash: a.hash.slice(1),
      origin,
      pathname,
      path: `${pathname}${a.search}`
    }
  }
  return urlCache[url]
}
