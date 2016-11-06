/* eslint no-unused-vars: "off" */
/* eslint import/no-unassigned-import: "off" */
/* eslint-env browser */

import 'core-js/modules/es6.promise'
import 'whatwg-fetch'
import '../styles/base.styl'

import delegate from './delegate'
import parseUrl from './parse-url'
import Historia from './historia'
import Alert from './alert'

const pageCache = {}
function fetchPage(path) {
  if (pageCache[path]) {
    return Promise.resolve(pageCache[path])
  }

  return fetch(path)
    .then(response => {
      if (response.ok) return response.text()
      throw new Error(`${response.status}: ${response.statusText}`)
    }).then(html => {
      const content = getPageContent(html)
      if (!content) throw new Error(`Could not parse content for ${path}.`)
      pageCache[path] = content
      return content
    }).catch(err => {
      Alert.push('Oh no! There was an error making your request.')
      throw err
    })
}

const pageContentFilter = /<main[^>]*>([\s\S]*)<\/main>/
function getPageContent(html) {
  const match = pageContentFilter.exec(html)
  return match && match[1]
}

const pageContainer = document.querySelector('main')
function setPageContent(content) {
  pageContainer.innerHTML = content
  const scripts = pageContainer.querySelectorAll('script')
  for (let i = 0; i < scripts.length; ++i) {
    const node = scripts[i]
    const parent = node.parentNode
    const newNode = document.createElement('script')
    newNode.async = node.async
    newNode.src = node.src
    parent.insertBefore(newNode, node)
    parent.removeChild(node)
  }
}

function setScroll(hash) {
  const target = hash && document.getElementById(hash)
  const scrollPos = target ? target.offsetTop : 0
  window.scrollTo(0, scrollPos)
}

function init() {
  if (!window.history || !window.history.pushState) return

  pageCache[location.pathname] = pageContainer.innerHTML
  Alert.push('This is a test.')

  const historia = new Historia(state => {
    return fetchPage(state.path)
      .then(content => setPageContent(content))
      .then(() => setScroll(state.hash))
      .catch(err => { /* We should track these */ })
  })

  delegate(document.body, 'click', 'a[href]', (e, el) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.which > 1) return

    const link = parseUrl(el.href)
    const page = parseUrl(location.href)

    if (el.href === location.href) e.preventDefault()
    else if (link.origin === page.origin && link.path !== page.path) {
      e.preventDefault()
      historia.push({url: link.href, title: el.title || el.innerText})
    }
  }, true)
}

init()
