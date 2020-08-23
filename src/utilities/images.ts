import fastGlob from 'fast-glob'
import path from 'path'
import sharp, { Sharp } from 'sharp'
import uuid from 'uuid'

import ImageNativeTypesEnum from './@enums/ImageNativeTypesEnum'
import ImageTypesEnum from './@enums/ImageTypesEnum'
import { cache } from './cache'
import { dataPaths } from './dataPaths'

const getSharpObjectFromSource = (src: string): Sharp => {
  return sharp(src)
    .raw()
    .flatten()
}

const convertImage = async (src: string): Promise<string> => {
  if (!src) {
    throw new Error('Invalid source provided')
  }

  const ext = src.split('.').pop()

  // native supported images
  if (ext && ext in ImageNativeTypesEnum) {
    return src
  }

  // check cache
  const cached = cache.get(src)
  if (cached) {
    return cached
  }

  // generate random tmp url
  const url = path.join(dataPaths.tmp, `${uuid()}.jpg`)
  cache.set(src, url)

  // save file for preview
  await getSharpObjectFromSource(src)
    .jpeg()
    .toFile(url)

  // returns new url
  return url
}

const logImageData = async (
  src: string | Sharp,
  name?: string
): Promise<string> => {
  let img: Sharp
  const target = path.join(dataPaths.tmp, `${name || uuid()}.jpg`)

  if (typeof src === 'string') {
    img = getSharpObjectFromSource(src)
  } else {
    img = src.clone()
  }

  await img.jpeg().toFile(target)

  return target
}

const getImagePaths = async (dir: string): Promise<string[]> => {
  const loc = dir.replace(/\\/g, '/')
  const exts = Object.keys(ImageTypesEnum)
  // avoid deep directory scan in test env
  const glob =
    process.env.NODE_ENV === 'test'
      ? `${loc}/*.{${exts}}`.replace('//', '/')
      : `${loc}/**/*.{${exts}}`.replace('//', '/')

  return fastGlob(glob, {
    absolute: true,
    onlyFiles: true,
  })
}

export { convertImage, getImagePaths, logImageData, getSharpObjectFromSource }
