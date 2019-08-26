import DesignData from './DesignData'

interface WorkerInput {
  stop?: boolean
  designData?: DesignData
  imagesDirectory?: string
  imagePaths?: string[]
  keyPath?: string
  resultPath?: string
}

export default WorkerInput
