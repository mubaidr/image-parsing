import Result from '../@classes/Result'
import DesignData from './DesignData'

interface WorkerInput {
  designData: DesignData
  exportDirectory?: string
  imagePaths?: string[]
  imagesDirectory?: string
  keyPath?: string
  percentOfFiles?: number
  resultPath?: string
  results?: Result[]
  keys?: Result[]
  stop?: boolean
  correctMarks?: number
  incorrectMarks?: number
}

export default WorkerInput
