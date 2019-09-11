import ProgressStateEnum from '../@enums/ProgressStateEnum'

interface WorkerOutput {
  state: ProgressStateEnum
  timeElapsed?: number
  workerType?: string
  data?: {} | null | undefined
}

export default WorkerOutput
