interface Callbacks {
  onprogress: (data: any) => void
  onsuccess: (data: any) => void
  onerror: (data: any) => void
  onstart?: (data: any) => void
  onexit?: (data: any) => void
}

export default Callbacks
