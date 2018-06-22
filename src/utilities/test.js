const processModule = require('./process')
const trainModule = require('./train')

if (process.env.TEST_TYPE === 'process') {
  processModule.process(
    'D:\\Current\\image-parsing\\sample-data\\design\\AnswerSheet-1.svg',
    'D:\\Current\\image-parsing\\sample-data\\image\\Processed',
    'D:\\Current\\image-parsing\\training-data\\data.json',
    'D:\\Current\\image-parsing\\sample-data\\result',
    false
  )
} else if (process.env.TEST_TYPE === 'train') {
  trainModule.train(
    'D:\\Current\\image-parsing\\sample-data\\design\\AnswerSheet-1.svg',
    'D:\\Current\\image-parsing\\sample-data\\image\\Processed',
    'D:\\Current\\image-parsing\\sample-data\\result\\AnswerSheet_Data.csv',
    'D:\\Current\\image-parsing\\training-data\\data.json'
  )
}
