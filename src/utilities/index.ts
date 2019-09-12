import brain, { INeuralNetworkJSON } from 'brain.js'
import fs from 'fs'

import Result from './@classes/Result'
import KeyNativeEnum from './@enums/KeyNativeEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { importExcelToJson } from './excel'
import extractTask from './workers/workerExtract'

const getQuestionsNeuralNet = (): brain.NeuralNetwork => {
  const text = fs.readFileSync(dataPaths.questionsModel).toString()
  const json: INeuralNetworkJSON = JSON.parse(text)

  return new brain.NeuralNetwork().fromJSON(json)
}

const convertToBitArray = (data: number[], channels: number): number[] => {
  const binaryData: number[] = []

  for (let i = 0, dataLength = data.length; i < dataLength; i += channels) {
    const threshold = 15
    const thresholdBlack = 80
    const [r, g, b] = data.slice(i, i + channels)
    const avg = Math.ceil((r + g + b) / channels)
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= thresholdBlack) {
      // Black pixel
      binaryData.push(0)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      g <= upperLimit &&
      g >= lowerLimit &&
      b <= upperLimit &&
      b >= lowerLimit
    ) {
      // Grey pixel
      binaryData.push(1)
    } else {
      // Color pixel
      binaryData.push(0)
    }
  }

  return binaryData
}

const readKey = async (src: string): Promise<Result[] | undefined> => {
  const ext = src.split('.').pop()

  if (ext === undefined) throw new Error('Invalid path specified')

  if (ext in KeyNativeEnum) {
    const rows = importExcelToJson(src)
    const results: Result[] = []

    for (let i = 0, len = rows.length; i < len; i += 1) {
      results.push(Result.fromJson(rows[i]))
    }

    return results
  }

  console.log('yehn group is here.... !!!!')

  const designData = getDesignData(dataPaths.designBarcode)
  const keys = await extractTask.start(
    {
      designData,
      imagePaths: [src],
    },
    false,
  )

  return keys
}

export { convertToBitArray, getQuestionsNeuralNet, readKey }
