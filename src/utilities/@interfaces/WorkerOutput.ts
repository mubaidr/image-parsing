import ProgressStateEnum from '../@enums/ProgressStateEnum'

interface WorkerOutput {
  state: ProgressStateEnum
  workerType?: string
  data?: {}
}

export default WorkerOutput
