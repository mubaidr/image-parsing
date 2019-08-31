import DesignData from './DesignData'

interface WorkerInput {
  stop?: boolean
  designData: DesignData
  imagePaths?: string[]
  resultPath?: string
  keyPath?: string
  imagesDirectory?: string
  exportDirectory?: string
}

export default WorkerInput
