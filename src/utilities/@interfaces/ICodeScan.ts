interface ICodeScan {
  [key: string]: string | number | boolean | null | string[]
  id: string
  center: string
  post: string
  rollNo: string | null
  time: string
  type: string
  hasValidRollNo: boolean
}

export default ICodeScan
