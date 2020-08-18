import WorkerInput from '../@interfaces/WorkerInput'

// import WorkerOutput from '../@interfaces/WorkerOutput'

// function sendMessage(obj: WorkerOutput): void {
//   if (process && process.send) {
//     process.send(obj)
//   }
// }

function start(msg: WorkerInput, isChildProcess: boolean): undefined {
  console.log('start', msg, isChildProcess)

  return
}

function stop(): void {
  process.exit(0)
}

// add message listner
process.on('message', msg => {
  if (msg.stop) {
    stop()
  } else {
    start(msg, true)
  }
})

process.on('unhandledRejection', error => {
  console.error(error)

  stop()
})

process.on('uncaughtException', error => {
  console.error(error)

  stop()
})

process.on('warning', warning => {
  console.warn(warning)
})

export default { start, stop }
