module.exports = {
  // function to encode file data to base64 encoded string
  base64_encode(bitmap) {
    return Buffer.from(bitmap).toString('base64')
  },
  // function to create file from base64 encoded string
  base64_decode(base64str) {
    return Buffer.from(base64str, 'base64')
  }
}
