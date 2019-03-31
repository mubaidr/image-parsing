interface ICodeScan {
  id: string
  center: string
  post: string
  rollNo: string | null
  time: string
  type: string
  hasValidRollNo: boolean
}

export default ICodeScan
