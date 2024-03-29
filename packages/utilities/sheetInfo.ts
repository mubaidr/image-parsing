import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
} from '@zxing/library/cjs';
import type { DesignData } from './design';
import type { Image } from './Image';

// TODO: deploy a electorn webworker for BarcodeDecoder and TextDecoder
// TODO: get barcode/text from electron webworker through worker manager

// function extractText(image: Image): string | undefined {
function extractText(): string | undefined {
  return undefined;
}

function decode(image: Image, isQrCode = false): string {
  const hints = new Map();
  hints.set(DecodeHintType.TRY_HARDER, 1);

  if (isQrCode) {
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
  } else {
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39]);
    hints.set(DecodeHintType.PURE_BARCODE, 1);
  }

  const length = image.width * image.height;
  const luminancesUint8Array = new Uint8ClampedArray(length);

  for (let i = 0; i < length; i++) {
    luminancesUint8Array[i] =
      ((image.data[i * image.channels] +
        image.data[i * image.channels + 1] +
        image.data[i * image.channels + 2]) /
        image.channels) &
      0xff;
  }

  const decode = new MultiFormatReader().decode(
    new BinaryBitmap(
      new HybridBinarizer(
        new RGBLuminanceSource(luminancesUint8Array, image.width, image.height),
      ),
    ),
    hints,
  );

  return decode.getText();
}

export async function getSheetInfoFromImage(
  designData: DesignData,
  image: Image,
): Promise<string | undefined> {
  let sheetInfo: string | undefined;
  const ratioX = image.width / designData.width;
  const ratioY = image.height / designData.height;

  const extracted = image.extract(
    Math.floor(designData.code.x * ratioX),
    Math.floor(designData.code.y * ratioY),
    Math.ceil(designData.code.width * ratioX),
    Math.ceil(designData.code.height * ratioY),
  );

  try {
    sheetInfo = decode(extracted, designData.isQrCode);
  } catch {
    sheetInfo = extractText();
  }

  // TODO: extract question paper, center, vacancy etc info from qrcode

  return sheetInfo;
}
