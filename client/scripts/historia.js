/* eslint-env browser */

import parseUrl from './parse-url'

export default class Historia {
  constructor(onChange) {
    this.onChange = onChange
    this.state = getState(location.href, document.title)
    history.replaceState(this.state, this.state.title, this.state.href)

    window.addEventListener('popstate', e => {
      const url = location.href
      const title = e.state && e.state.title
      this.push({url, title, isPopState: true})
    })
  }

  push({url, title, isPopState}) {
    const prevState = this.state
    const nextState = getState(url, title)
    this.state = nextState
    if (prevState.path === nextState.path) return Promise.resolve(null)
    return this.onChange(nextState).then(() => {
      if (!isPopState) history.pushState(nextState, nextState.title, nextState.href)
      if (nextState.title) document.title = nextState.title
    })
  }
}

function getState(url, title) {
  const state = parseUrl(url)
  state.title = title ? `${title} | Andreas McDermott` : 'Andreas McDermott'
  return state
}
