import IDesignData from './IDesignData'

export interface IWorkerManager {
  getCount(): number
  create(): {}
  stop(): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset(): any
  process(
    designData: IDesignData,
    images: string[],
    callback: Function
  ): { totalImages: number; totalWorkers: number }
}
