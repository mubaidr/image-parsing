import WorkerInput from './WorkerInput'

interface WorkerManagerInput {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data: WorkerInput
}

export default WorkerManagerInput
