import {
  WorkerInputExtract, WorkerInputGenerateAnswerSheets, WorkerInputGenerateTestData,
  WorkerInputTrain,
} from './WorkerInput'

interface WorkerManagerInput {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data:
    | WorkerInputExtract
    | WorkerInputTrain
    | WorkerInputGenerateAnswerSheets
    | WorkerInputGenerateTestData
}

export default WorkerManagerInput
