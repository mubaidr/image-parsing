import Callbacks from './Callbacks'
import WorkerInput from './WorkerInput'

interface WorkerManagerInput {
  callbacks: Callbacks
  inProcess?: boolean
  designPath: string
  data: WorkerInput
}

export default WorkerManagerInput
