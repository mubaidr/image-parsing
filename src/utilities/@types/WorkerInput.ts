import {
  WorkerInputExtract, WorkerInputGenerateAnswerSheets, WorkerInputGenerateTestData,
  WorkerInputTrain,
} from '../@interfaces/WorkerInput'

export type WorkerManagerInputExtract = {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data: WorkerInputExtract
}

export type WorkerManagerInputTrain = {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data: WorkerInputTrain
}

export type WorkerManagerInputGenerateAnswerSheets = {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data: WorkerInputGenerateAnswerSheets
}

export type WorkerManagerInputGenerateTestData = {
  callback: (data: object) => void
  inProcess?: boolean
  designPath: string
  data: WorkerInputGenerateTestData
}
