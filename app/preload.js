'use strict'

const {ipcRenderer} = require('electron')

function trigger(keyCode) {
  const keyDown = new Event('keydown')
  keyDown.keyCode = keyCode
  document.dispatchEvent(keyDown)

  const keyUp = new Event('keyup')
  keyUp.keyCode = keyCode
  document.dispatchEvent(keyUp)
}

function navigate(url) {
  history.replaceState(null, null, url)
  const e = new Event('popstate')
  window.dispatchEvent(e)
}

ipcRenderer.on('playPause', () => trigger(32))
ipcRenderer.on('next', () => trigger(74))
ipcRenderer.on('previous', () => trigger(75))
ipcRenderer.on('help', () => trigger(72))
ipcRenderer.on('isPlaying', (event) => {
  const isPlaying = !!document.querySelector('.playing')
  event.sender.send('isPlaying', isPlaying)
})
ipcRenderer.on('navigate', (_, url) => {
  navigate(url)
})

const Notification = window.Notification
ipcRenderer.on('notification', (_, title, body) => {
  new Notification(title, { body, silent: true })
})
// Swallow SoundCloud's own notifications, because:
// - They are not silent on macOS
// - They are hidden behind a feature flag
window.Notification = function() {}

const confirm = window.confirm

window.confirm = function(message) {
  // For some bizarre reason SoundCloud calls comfirm() with { string: 'The message' }
  if (message && message.string)
    return confirm(message.string)
  else
    return confirm(message)
}