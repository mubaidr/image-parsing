import csvtojson from 'csvtojson'
import ICodeScan from './@interfaces/ICodeScan'

type CsvToJsonGetter = (csv: string, isPath: boolean) => Promise<ICodeScan[]>

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
