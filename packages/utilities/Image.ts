import fastGlob from 'fast-glob';
import path from 'path';
import type { Sharp } from 'sharp';
import sharp from 'sharp';
import { v4 as uuid4 } from 'uuid';
import { DataPaths } from './dataPaths';

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

// average using linear approximation of gamma & perceptual luminance correction
function pixelAverage(r: number, g: number, b: number): number {
  return Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
}

export class Image {
  static TARGET_SIZE = 1280;
  static CHANNELS = 3;

  public id: string;
  public source: string;
  public isNative = false;
  public channels = Image.CHANNELS;
  public width = 0;
  public height = 0;
  public data: Uint8ClampedArray = Uint8ClampedArray.from([]);

  constructor(source: string) {
    this.id = uuid4();
    this.source = source;

    const extension = source.split('.').pop();
    if (extension && extension in ImageNativeTypes) {
      this.isNative = true;
    }
  }

  static readDirectory(dir: string): string[] {
    const loc = dir.replace(/\\/g, '/');
    const exts = Object.keys(ImageTypes).map((ext) => `.${ext}`);
    const glob = `${loc}/**/*{${exts}}`.replace('//', '/');

    return fastGlob.sync(glob, {
      absolute: true,
      onlyFiles: true,
      stats: false,
    });
  }

  static async load(source: string): Promise<Image> {
    const { data, info } = await sharp(source)
      .resize(Image.TARGET_SIZE, null, {
        kernel: sharp.kernel.mitchell,
        fastShrinkOnLoad: false,
        withoutEnlargement: true,
      })
      .flatten()
      .median(3)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const image = new Image(source);

    image.data = Uint8ClampedArray.from(data);
    image.width = info.width;
    image.height = info.height;
    image.channels = info.channels;

    return image;
  }

  async log(name: string = uuid4(), location?: string): Promise<string> {
    const target = path.join(location || DataPaths.tmp, `${name}.jpg`);

    await this.toSharpObject()
      .jpeg()
      .toFile(target)
      .then(() => {
        console.info(`[log] : ${target}`);
      })
      .catch(console.error);

    return target;
  }

  toSharpObject(): Sharp {
    return sharp(Buffer.from(this.data), {
      raw: {
        width: this.width,
        height: this.height,
        channels: this.channels as 1 | 2 | 3 | 4,
      },
    });
  }

  clone(data?: Uint8ClampedArray, width?: number, height?: number): Image {
    const image = new Image(this.source);

    image.isNative = this.isNative;
    image.width = width ? width : this.width;
    image.height = height ? height : this.height;
    image.data = data ? data : Uint8ClampedArray.from([...this.data]);

    return image;
  }

  greyscale(): Image {
    return this.grayscale();
  }

  grayscale(): Image {
    for (let i = 0; i < this.data.length; i += this.channels) {
      const [r, g, b] = this.data.slice(i, i + this.channels);
      this.data[i] =
        this.data[i + 1] =
        this.data[i + 2] =
          pixelAverage(r, g, b);
    }

    return this;
  }

  toBitImage(): Image {
    const data: number[] = [];

    for (let i = 0; i < this.data.length; i += this.channels) {
      const [r, g, b] = this.data.slice(i, i + this.channels);
      data.push(pixelAverage(r, g, b));
    }

    this.channels = 1;
    this.data = new Uint8ClampedArray(data);

    return this;
  }

  getPercentFilled(): number {
    let sum = 0;

    for (let i = 0; i < this.data.length; i += this.channels) {
      const [r, g, b] = this.data.slice(i, i + this.channels);
      const avg = pixelAverage(r, g, b);
      const threshold = 25;
      const thresholdBlack = 75;
      const upperLimit = avg + threshold;
      const lowerLimit = avg - threshold;

      if (avg <= thresholdBlack) {
        // Black pixel
        sum += 1;
      } else if (
        r <= upperLimit &&
        r >= lowerLimit &&
        g <= upperLimit &&
        g >= lowerLimit &&
        b <= upperLimit &&
        b >= lowerLimit
      ) {
        // Grey pixel
        continue;
      } else {
        // Color pixel
        sum += 1;
      }
    }

    return (sum / (this.data.length / 3)) * 100;
  }

  extract(x = 0, y = 0, width = this.width, height = this.height): Image {
    const data = new Uint8ClampedArray(width * height * this.channels);

    for (let top = y; top < y + height; top += 1) {
      const start = (top * this.width + x) * this.channels;
      const end = (top * this.width + x + width - 1) * this.channels;
      const row = top - y;
      data.set(this.data.slice(start, end), row * width * this.channels);
    }

    return this.clone(data, width, height);
  }

  // getShapes<T extends ShapeTypes>(shapeType: ShapeTypes): T[] {
  //   return contoursUtility.getShapes<T>(this.clone().grayscale(), shapeType)
  // }
}
