class Cache {
  private list: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    [key: string]: any
  }

  public constructor() {
    this.list = {}
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public get(key: string): any {
    return this.list[key]
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public remove(key: string): any {
    const t = this.list[key]
    delete this.list[key]

    return t
  }

  public reset() {
    this.list = {}
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public set(key: string, value: any): any {
    this.list[key] = value

    return value
  }
}

export default Cache
