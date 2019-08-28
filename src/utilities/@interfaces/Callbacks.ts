import CompiledResult from '../@classes/CompiledResult'

interface Callbacks {
  onprogress: (data: object) => void
  onsuccess: (data: object | CompiledResult) => void
  onerror: (data: object) => void
  onstart?: (data: object) => void
  onwarning?: (data: object) => void
  onclose?: (data: object) => void
  onlog?: (data: object) => void
}

export default Callbacks
