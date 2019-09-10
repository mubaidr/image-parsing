import ProgressStateEnum from '../@enums/ProgressStateEnum'

interface WorkerOutput {
  state: ProgressStateEnum
  timeElapsed?: number
  workerType?: string
  data?: {}
}

export default WorkerOutput
