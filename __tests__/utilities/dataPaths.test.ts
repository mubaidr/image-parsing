import fs from 'fs'

import { dataPaths } from '../../src/utilities/dataPaths'

describe('dataPaths', () => {
  test('should be defined', () => {
    expect(dataPaths).toBeDefined()

    Object.values(dataPaths).forEach(path => {
      expect(typeof path).toBe('string')
      expect(fs.existsSync(path)).toBeTruthy()
    })
  })
})
