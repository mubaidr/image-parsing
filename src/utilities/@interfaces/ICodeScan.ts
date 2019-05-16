interface ICodeScan {
  [key: string]: string | number | boolean | null
  id: string
  center: string
  post: string
  rollNo: string | null
  time: string
  type: string
  hasValidRollNo: boolean
}

export default ICodeScan
