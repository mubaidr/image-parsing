/**
 *
 * Implements Moore-Neighbor Tracing
 *
 * */

import { Image } from './Image'

export enum ShapeTypes {
  Rectangle,
  Circle,
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface Circle {
  x: number
  y: number
  radius: number
}

// list of neighbours to visit
function getNeighbours(width: number, i: number, start: number) {
  const mask: number[] = []

  if (i % width === 0) {
    mask[0] = mask[6] = mask[7] = -1
  }

  if ((i + 1) % width === 0) {
    mask[2] = mask[3] = mask[4] = -1
  }

  // hack - vertical edging matters less because
  // it will get ignored by matching it to the source

  return offset(
    [
      mask[0] || i - width - 1,
      mask[1] || i - width,
      mask[2] || i - width + 1,
      mask[3] || i + 1,
      mask[4] || i + width + 1,
      mask[5] || i + width,
      mask[6] || i + width - 1,
      mask[7] || i - 1,
    ],
    start
  )
}

const offset = (array: number[], by: number) => {
  return array.map((_v, i) => array[(i + by) % array.length])
}

const traceContour = (image: Image, i: number) => {
  const start = i
  const contour = [start]

  let direction = 3
  let p = start

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const n = getNeighbours(image.width, p, 0)

    // find the first neighbour starting from
    // the direction we came from
    const offset = direction - 3 + 8
    /*
    directions:
      0   1   2
      7       3
      6   5   4
    start indexes:
      5  6   7
      4      0
      3  2   1
    */

    direction = -1
    for (let idx, i = 0; i < 8; i++) {
      idx = (i + offset) % 8

      if (image.data[n[idx] * image.channels] > 0) {
        direction = idx
        break
      }
    }

    p = n[direction]

    if (p === start || !p) {
      break
    } else {
      contour.push(p)
    }
  }

  return contour
}

function getContours(image: Image): number[][] {
  const contours: number[][] = []
  const seen: boolean[] = []
  let skipping = false

  for (let i = 0; i < image.data.length; i++) {
    if (image.data[i * image.channels] > 128) {
      if (seen[i] || skipping) {
        skipping = true
      } else {
        const contour = traceContour(image, i)

        contours.push(contour)

        // this could be a _lot_ more efficient
        contour.forEach((c) => {
          seen[c] = true
        })
      }
    } else {
      skipping = false
    }
  }

  return contours
}

function getBoundingRectangle(contour: number[]): Rectangle {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
}

function getBoundingCircle(contour: number[]): Circle {
  return {
    x: 0,
    y: 0,
    radius: 0,
  }
}

export function getShapes<T extends ShapeTypes>(
  image: Image,
  shapeType: ShapeTypes
): T[] {
  const shapes: T[] = []

  getContours(image).forEach((contour) => {
    console.log(contour)

    let shape: T

    if (shapeType === ShapeTypes.Rectangle) {
      shape = (getBoundingRectangle(contour) as unknown) as T
    } else {
      shape = (getBoundingCircle(contour) as unknown) as T
    }

    shapes.push(shape)
  })

  return shapes
}
