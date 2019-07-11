import csvtojson from 'csvtojson'
import CompiledResult from './@classes/CompiledResult'

const csvToJson = async (
  csv: string,
  isPath: boolean
): Promise<CompiledResult[]> => {
  const csvTool = csvtojson({
    flatKeys: true,
  })

  if (isPath) {
    return csvTool.fromFile(csv)
  }

  return csvTool.fromString(csv)
}

export { csvToJson }
