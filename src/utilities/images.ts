import fastGlob from 'fast-glob'
import NodeCache from 'node-cache'
import path from 'path'
import sharp, { Sharp } from 'sharp'
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

export async function getSharpObjectFromSource(src: string): Promise<Sharp> {
  return sharp(src).flatten().blur().raw()

  // let sharpImage = sharp(src).flatten().raw()
  // const { width, height } = await sharpImage.metadata()
  // const padding = 10

  // if (!width || !height) throw 'Invalid image file'

  // sharpImage = sharp(
  //   await sharpImage
  //     .extract({
  //       left: padding,
  //       top: padding,
  //       width: width - padding * 2,
  //       height: height - padding * 2,
  //     })
  //     .toBuffer()
  // )
  //   .trim(175)
  //   .flatten()
  //   .raw()

  // logImageData(sharpImage, `trimmed ${padding}`)

  // return sharpImage
}

export async function convertImage(src: string): Promise<string> {
  if (!src) {
    throw new Error('Invalid source provided')
  }

  const ext = src.split('.').pop()

  // native supported images
  if (ext && ext in ImageNativeTypes) {
    return src
  }

  // check cache
  const cached = myCache.get(src)
  if (cached !== undefined) {
    return cached as string
  }

  // // generate random tmp url
  const url = path.join(DataPaths.tmp, `${uuid4()}.jpg`)
  myCache.set(src, url)

  // save file for preview
  const sharpImg = await getSharpObjectFromSource(src)

  await sharpImg.jpeg().toFile(url)

  // returns new url
  return url
}

export async function logImageData(
  src: string | Sharp,
  name?: string
): Promise<string> {
  let img: Sharp
  const target = path.join(DataPaths.tmp, `${name || uuid4()}.jpg`)

  if (typeof src === 'string') {
    img = await getSharpObjectFromSource(src)
  } else {
    img = src.clone()
  }

  img.jpeg().toFile(target)

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
