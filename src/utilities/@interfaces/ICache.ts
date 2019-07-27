/* eslint-disable @typescript-eslint/no-explicit-any */
interface ICache {
  get(key: string): any
  set(key: string, value: any): any
  remove(key: string): any
  reset(): void
}

export default ICache
