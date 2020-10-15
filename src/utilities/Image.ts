import fastGlob from 'fast-glob'
import NodeCache from 'node-cache'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuid4 } from 'uuid'
import { DataPaths } from './dataPaths'

const myCache = new NodeCache()

export enum ImageNativeTypes {
  bmp,
  gif,
  jfif,
  jpe,
  jpeg,
  jpg,
  png,
  svg,
  webp,
}

export enum ImageTypes {
  bmp,
  dib,
  gif,
  jfif,
  jpe,
  jpeg,
  jpg,
  png,
  svg,
  tif,
  tiff,
  webp,
}

export class Image {
  static TARGET_SIZE = 1240
  id: string
  source: string
  isNative = false
  width = 0
  height = 0
  data: Uint8ClampedArray = Uint8ClampedArray.from([])

  constructor(source: string) {
    this.id = uuid4()
    this.source = source

    const extension = source.split('.').pop()
    if (extension && extension in ImageNativeTypes) {
      this.isNative = true
    }
  }

  static readDirectory(dir: string): string[] {
    const loc = dir.replace(/\\/g, '/')
    const exts = Object.keys(ImageTypes).map((ext) => `.${ext}`)
    const glob = `${loc}/**/*{${exts}}`.replace('//', '/')

    return fastGlob.sync(glob, {
      absolute: true,
      onlyFiles: true,
      stats: false,
    })
  }

  static async load(source: string, avoidResize = false): Promise<Image> {
    const sharpImage = sharp(source)

    if (!avoidResize) sharpImage.resize(Image.TARGET_SIZE)

    const { data, info } = await sharpImage
      .raw()
      .flatten()
      .toBuffer({ resolveWithObject: true })

    const image = new Image(source)

    image.data = Uint8ClampedArray.from(data)
    image.width = info.width
    image.height = info.height

    return image
  }

  log(name: string = uuid4(), location?: string): void {
    const target = path.join(location || DataPaths.tmp, `${name}.jpg`)
    // BUG: Sharp instance
    // await sharp(src).jpeg().toFile(target)
    console.log(`[log] : ${target}`)
  }

  clone(): Image {
    const image = new Image(this.source)
    image.width = this.width
    image.height = this.height
    image.isNative = this.isNative
    image.data = Uint8ClampedArray.from([...this.data])

    return image
  }

  grayscale(): Image {
    for (let i = 0; i < this.data.length; i += 3) {
      const brightness =
        0.34 * this.data[i] + 0.5 * this.data[i + 1] + 0.16 * this.data[i + 2]

      this.data[i] = this.data[i + 1] = this.data[i + 2] = brightness
    }

    return this
  }

  getPercentFilled(): number {
    let sum = 0

    for (let i = 0; i < this.data.length; i += 3) {
      const [r, g, b] = this.data.slice(i, i + 3)
      const threshold = 15
      const thresholdBlack = 80
      const avg = Math.ceil(0.34 * r + 0.5 * g + 0.16 * b)
      const upperLimit = avg + threshold
      const lowerLimit = avg - threshold

      if (avg <= thresholdBlack) {
        // Black pixel
        sum += 1
      } else if (
        r <= upperLimit &&
        r >= lowerLimit &&
        g <= upperLimit &&
        g >= lowerLimit &&
        b <= upperLimit &&
        b >= lowerLimit
      ) {
        // Grey pixel
        continue
      } else {
        // Color pixel
        sum += 1
      }
    }

    return (sum / (this.data.length / 3)) * 100
  }

  extract(x = 0, y = 0, width = this.width, height = this.height): Image {
    const dummyData: number[] = []
    for (let i = 0; i < this.width * this.height * 3; i += 1) {
      dummyData.push(i)
    }

    console.log(this.width, this.height, ...dummyData)

    const data = new Uint8ClampedArray(width * height * 3)

    for (let top = y; top < y + height; top += 1) {
      const start = (top * width + x) * 3
      const end = (top * width + x + width) * 3
      const row = top - y

      // data.set(dummyData.slice(start, end), row * width * 3)
      console.log(
        row,
        ' : ',
        end - start,
        ' : ',
        ...dummyData.slice(start, end)
      )
    }

    // console.log('TCL: ----------------------------------')
    // console.log('TCL: Image -> extract -> data \n\n', ...data)
    // console.log('TCL: ----------------------------------')

    const image = new Image(this.source)
    image.width = width
    image.height = height
    image.data = data
    image.isNative = this.isNative

    return image
  }
}
