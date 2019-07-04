class Cache {
  private list: string[] = []

  get ( id: string ): string | undefined {
    if(!id) return undefined

    const item = this.list[id]
    if ( item ) return item else return undefined
  }
}

export default Cache
