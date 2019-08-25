async function startTask() {}

async function stopTask() {
  process.exit(0)
}

process.on('message', e => {
  if (e.stop) {
    stopTask()
  } else {
    startTask()
  }
})

// add message listner
process.on('message', msg => {
  if (msg.stop) {
    stopTask()
  } else {
    startTask()
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

export { startTask, stopTask }
