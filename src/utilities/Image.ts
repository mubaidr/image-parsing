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
  source: string
  data: Uint8ClampedArray = Uint8ClampedArray.from([])
  width = 0
  height = 0

  constructor(source: string) {
    this.source = source
  }

  static async load(source: string): Promise<Image> {
    const { data, info } = await sharp(source)
      .resize(1240)
      .flatten()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const image = new Image(source)

    image.data = Uint8ClampedArray.from(data)
    image.width = info.width
    image.height = info.height

    return image
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

  async write(src: string | ImageData, name?: string): Promise<string> {
    const target = path.join(DataPaths.tmp, `${name || uuid4()}.jpg`)

    if (typeof src !== 'string') {
      sharp(Buffer.from(src.data)).jpeg().toFile(target)
      return target
    }

    // check cache
    const cached = myCache.get(src)
    if (cached) {
      return cached as string
    } else {
      myCache.set(src, target)
    }

    sharp(src).jpeg().toFile(target)

    return target
  }

  extract(x: number, y: number, width: number, height: number): Image {
    return this
  }
}
