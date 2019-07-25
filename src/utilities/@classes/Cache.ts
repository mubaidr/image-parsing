/* eslint-disable @typescript-eslint/no-explicit-any */

class Cache {
  private list: {
    [key: string]: any
  }

  public constructor() {
    this.list = {}
  }

  public get(key: string): any {
    return this.list[key]
  }

  public set(key: string, value: any): any {
    this.list[key] = value

    return value
  }

  public remove(key: string): any {
    const t = this.list[key]
    delete this.list[key]

    return t
  }

  public reset() {
    this.list = {}
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */

export default Cache
