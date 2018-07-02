const { train } = require('./train')

train(
  'D:\\Current\\image-parsing\\__tests__\\test-data\\design.svg',
  'D:\\Current\\image-parsing\\__tests__\\test-data\\images',
  'D:\\Current\\image-parsing\\__tests__\\test-data\\result.csv',
  'D:\\Current\\image-parsing\\src\\data\\training-data.json'
)
