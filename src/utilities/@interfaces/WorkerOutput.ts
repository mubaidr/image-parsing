import ProgressStateEnum from '../@enums/ProgressStateEnum'

interface WorkerOutput {
  state: ProgressStateEnum
  timeElapsed?: number
  workerType?: string
  data?: Record<string, unknown>
}

export default WorkerOutput
