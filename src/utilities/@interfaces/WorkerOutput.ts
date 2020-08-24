import ProgressStateEnum from '../@enums/ProgressStateEnum'

interface WorkerOutput {
  state: ProgressStateEnum
  timeElapsed?: number
  workerType?: string
  data?: any[]
}

export default WorkerOutput
