import WorkerInput from '../@interfaces/WorkerInput'

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

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e))
process.on('warning', e => console.warn(e))

export { start, stop }
export default { start, stop }
