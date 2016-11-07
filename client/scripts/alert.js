/* eslint-env browser */

import delegate from './delegate'

let instance
export default class Alert {
  constructor() {
    this.template = document.getElementById('alert-message-template').textContent
    this.alertList = document.getElementById('alert-list')
  }

  add(message) {
    const newAlert = this.template.replace(/%%message%%/, message)
    const li = document.createElement('li')
    li.setAttribute('role', 'presentation')
    li.innerHTML = newAlert
    this.alertList.appendChild(li)
  }

  static push(message) {
    // if (!instance) {
    //   instance = new Alert()
    // }
    // instance.add(message)
  }
}
