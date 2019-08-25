async function start() {}

async function stop() {
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

process.on('unhandledRejection', rejection => {
  console.error(rejection)
})

process.on('uncaughtException', exception => {
  console.error(exception)
})

process.on('warning', warning => {
  console.warn(warning)
})

export { start, stop }
