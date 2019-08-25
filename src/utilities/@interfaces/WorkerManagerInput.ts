interface WorkerManagerInput {
  callback: (data: object) => void
  inProcess?: boolean
  imagesDirectory?: string
  designPath?: string
  keyPath?: string
  resultPath?: string
}

export default WorkerManagerInput
