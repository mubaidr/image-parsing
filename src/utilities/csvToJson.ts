import csvtojson from 'csvtojson'
import ICodeScan from './@interfaces/ICodeScan'

const csvToJson = async (
  csv: string,
  isPath: boolean
): Promise<ICodeScan[]> => {
  const csvTool = csvtojson({
    flatKeys: true,
  })

  if (isPath) {
    return csvTool.fromFile(csv)
  }

  return csvTool.fromString(csv)
}

export { csvToJson }
