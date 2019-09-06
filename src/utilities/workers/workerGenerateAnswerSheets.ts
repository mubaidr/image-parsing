function start(): void {
  console.log('start')
}

function stop(): void {
  process.exit(0)
}

process.on('message', e => {
  if (e.stop) {
    stop()
  } else {
    start()
  }
})

// add message listner
process.on('message', msg => {
  if (msg.stop) {
    stop()
  } else {
    start()
  }
})

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e))
process.on('warning', e => console.warn(e))

export { start, stop }
