const { process } = require('./process')
const { train } = require('./train')

if (process.env.TEST_TYPE === 'process') {
  process(
    'D:\\Current\\image-parsing\\sample-data\\design\\AnswerSheet-1.svg',
    'D:\\Current\\image-parsing\\sample-data\\image\\Processed',
    'D:\\Current\\image-parsing\\training-data\\data.json',
    'D:\\Current\\image-parsing\\sample-data\\result'
  )
} else {
  train(
    'D:\\Current\\image-parsing\\sample-data\\design\\AnswerSheet-1.svg',
    'D:\\Current\\image-parsing\\sample-data\\image\\Processed',
    'D:\\Current\\image-parsing\\training-data\\data.json',
    'D:\\Current\\image-parsing\\sample-data\\result\\AnswerSheet_Data.csv'
  )
}
