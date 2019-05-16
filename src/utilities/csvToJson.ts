import * as csvtojson from 'csvtojson'
import IKey from './@interfaces/IKey'

type CsvToJsonGetter = (csv: string, isPath: boolean) => Promise<IKey[]>

const csvToJson: CsvToJsonGetter = async (csv, isPath) => {
  const csvTool = csvtojson({
    flatKeys: true,
  })

  if (isPath) {
    return csvTool.fromFile(csv)
  }

  return csvTool.fromString(csv)
}

export { csvToJson }
