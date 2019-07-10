class Cache {
  private list: {
    [key: string]: string
  } = {}

  public get(key: string): string | null {
    if (typeof key !== 'string') return null

    const item = this.list[key]
    if (item) {
      return item
    } else {
      return null
    }
  }

  public set(key: string, value: string): string | null {
    if (typeof key !== 'string' && value) return null

    this.list[key] = value

    return value
  }
}

export default Cache
