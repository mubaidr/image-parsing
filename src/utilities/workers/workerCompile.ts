import CompiledResult from '../@classes/CompiledResult'
import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerInput from '../@interfaces/WorkerInput'

function stop(): void {
  process.exit(0)
}

function start(msg: WorkerInput): void {
  const { results, keys, correctMarks, incorrectMarks } = msg

  if (!results) throw 'Invalid results...'
  if (!keys) throw 'Invalid keys...'

  const compiledResult = new CompiledResult()

  results.forEach(result => {
    compiledResult.addResults(Result.fromJson(result))
  })

  keys.forEach(key => {
    compiledResult.addKeys(Result.fromJson(key))
  })

  compiledResult.compile(correctMarks, incorrectMarks)

  // report progress status
  if (process && process.send) {
    process.send({
      state: ProgressStateEnum.COMPLETED,
      compiledResult: compiledResult,
    })
  }
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    start(msg)
  }
})

export { start, stop }
