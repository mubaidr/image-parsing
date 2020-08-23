enum RegExpPattern {
  BARCODE = 'barcode$',
  NONE = '',
  OPTION = 'q[1-9][0-9]?[a-e]$',
  QRCODE = 'qrcode$',
  QUESTION = 'q[1-9][0-9]?$',
}

export default RegExpPattern
