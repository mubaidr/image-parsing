import fastGlob from 'fast-glob'
import NodeCache from 'node-cache'
import path from 'path'
import sharp, { Sharp } from 'sharp'
import { v4 as uuid4 } from 'uuid'
import { dataPaths } from './dataPaths'

const myCache = new NodeCache()

export enum IMAGE_NATIVE_TYPES {
  'bmp' = 'bmp',
  'gif' = 'gif',
  'jfif' = 'jfif',
  'jpe' = 'jpe',
  'jpeg' = 'jpeg',
  'jpg' = 'jpg',
  'png' = 'png',
  'svg' = 'svg',
  'webp' = 'webp',
}

export enum IMAGE_TYPES {
  'bmp' = 'bmp',
  'dib' = 'dib',
  'gif' = 'gif',
  'jfif' = 'jfif',
  'jpe' = 'jpe',
  'jpeg' = 'jpeg',
  'jpg' = 'jpg',
  'png' = 'png',
  'svg' = 'svg',
  'tif' = 'tif',
  'tiff' = 'tiff',
  'webp' = 'webp',
}

export async function getSharpObjectFromSource(src: string): Promise<Sharp> {
  let sharpImage = sharp(src, {
    failOnError: true,
  })
  const { width, height } = await sharpImage.metadata()
  const padding = 25

  if (!width || !height) throw 'Invalid image file'

  sharpImage = sharp(
    await sharpImage
      .extract({
        left: padding,
        top: padding,
        width: width - padding * 2,
        height: height - padding * 2,
      })
      .toBuffer()
  )
    .trim(175)
    .flatten()
    .raw()

  // logImageData(sharpImage, `trimmed ${padding}`)

  return sharpImage
}

export async function convertImage(src: string): Promise<string> {
  if (!src) {
    throw new Error('Invalid source provided')
  }

  const ext = src.split('.').pop()

  // native supported images
  if (ext && ext in IMAGE_NATIVE_TYPES) {
    return src
  }

  // check cache
  const cached = myCache.get(src)
  if (cached !== undefined) {
    return cached as string
  }

  // // generate random tmp url
  const url = path.join(dataPaths.tmp, `${uuid4()}.jpg`)
  myCache.set(src, url)

  // save file for preview
  getSharpObjectFromSource(src).then((img) => {
    img.jpeg().toFile(url)
  })

  // returns new url
  return url
}

export async function logImageData(
  src: string | Sharp,
  name?: string
): Promise<string> {
  let img: Sharp
  const target = path.join(dataPaths.tmp, `${name || uuid4()}.jpg`)

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
  const exts = Object.keys(IMAGE_TYPES).map((ext) => `.${ext}`)
  const glob = `${loc}/**/*{${exts}}`.replace('//', '/')

  return fastGlob.sync(glob, {
    absolute: true,
    onlyFiles: true,
    stats: false,
  })
}
