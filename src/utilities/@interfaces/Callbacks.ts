interface Callbacks {
  onprogress: (data: object) => void
  onsuccess: (data: object) => void
  onerror: (data: object) => void
  onstart?: (data: object) => void
  onwarning?: (data: object) => void
  onclose?: (data: object) => void
  onexit?: (data: object) => void
  onlog?: (data: object) => void
  ondisconnect?: (data: object) => void
}

export default Callbacks
