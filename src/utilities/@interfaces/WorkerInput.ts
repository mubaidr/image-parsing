import DesignData from './DesignData'

interface WorkerInput {
  stop?: boolean
}

export interface WorkerInputExtract extends WorkerInput {
  designData: DesignData
  imagePaths: string[]
}

export interface WorkerInputTrain extends WorkerInput {
  designData: DesignData
  resultPath: string
  keyPath: string
}

export interface WorkerInputGenerateAnswerSheets extends WorkerInput {
  designData: DesignData
  imagesDirectory: string
}

export interface WorkerInputGenerateTestData extends WorkerInput {
  designData: DesignData
  imagesDirectory: string
}

export default WorkerInput
