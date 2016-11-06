/* eslint-env browser */
/* eslint max-params: "off" */

const matches = Element.prototype.matches ||
              Element.prototype.matchesSelector ||
              Element.prototype.mozMatchesSelector ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.oMatchesSelector ||
              Element.prototype.webkitMatchesSelector ||
              function (selector) {
                const node = this
                const matchedNodes = node.parentNode.querySelectorAll(selector)
                for (let i = 0; i < matchedNodes.length; ++i) {
                  if (matchedNodes[i] === node) return true
                }
                return false
              }

const matchClosest = (node, selector) => {
  if (!node || node.nodeType !== 1) return null

  while (node && node.nodeType === 1) {
    if (matches.call(node, selector)) return node
    node = node.parentNode
  }
  return null
}

export default function delegate(ancestor, eventType, selector, callback, useCapture) {
  function listener(e) {
    const target = matchClosest(e.target, selector)
    if (target) callback.call(target, e, target)
  }

  ancestor.addEventListener(eventType, listener, useCapture)

  return () => ancestor.removeEventListener(eventType, listener, useCapture)
}
