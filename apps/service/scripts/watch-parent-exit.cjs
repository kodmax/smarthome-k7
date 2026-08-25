/**
 * Dev-only preload for `node --watch`: on Ctrl+C (SIGINT), kill the watch
 * parent when this child exits so Turbo does not hang.
 *
 * node --watch restarts via SIGTERM — we must NOT kill the parent then.
 */
let killWatchParent = false

process.on('SIGINT', () => {
  killWatchParent = true
})

process.on('exit', () => {
  if (!killWatchParent || process.ppid <= 1) {
    return
  }
  try {
    process.kill(process.ppid, 'SIGTERM')
  } catch {
    // watch parent already exiting
  }
})
