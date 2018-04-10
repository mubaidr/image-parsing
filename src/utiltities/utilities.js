module.exports = {
  // function to encode file data to base64 encoded string
  base64_encode(bitmap) {
    return Buffer.from(bitmap).toString('base64')
  },

  // function to create file from base64 encoded string
  base64_decode(base64str) {
    return Buffer.from(base64str, 'base64')
  },

  // returns milliseconds passed since provided time
  clock(start) {
    if (!start) return process.hrtime()
    const end = process.hrtime(start)
    return Math.round(end[0] * 1000 + end[1] / 1000000)
  }
}
