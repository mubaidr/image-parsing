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

export async function getImageDataFromSource(src: string): Promise<ImageData> {
  const { data, info } = await sharp(src)
    .resize(1240)
    .flatten()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return {
    data: Uint8ClampedArray.from(data),
    width: info.width,
    height: info.height,
  }
}

export async function logImageData(
  src: string | ImageData,
  name?: string
): Promise<string> {
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

export function getImagePaths(dir: string): string[] {
  const loc = dir.replace(/\\/g, '/')
  const exts = Object.keys(ImageTypes).map((ext) => `.${ext}`)
  const glob = `${loc}/**/*{${exts}}`.replace('//', '/')

  return fastGlob.sync(glob, {
    absolute: true,
    onlyFiles: true,
    stats: false,
  })
}
