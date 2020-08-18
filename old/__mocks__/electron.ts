module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: jest.fn(),
    getName: jest.fn(),
  },
  remote: jest.fn(),
  dialog: jest.fn(),
}
