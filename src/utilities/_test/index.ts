import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'

const str = readFileSync(
  'D:\\current\\image-parsing\\__tests__\\test-data\\design.svg'
).toString()

const options = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  allowBooleanAttributes: true,
}

const json = parse(str, options)

console.dir(json.svg)
