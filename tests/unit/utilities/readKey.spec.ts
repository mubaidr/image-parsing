import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'

describe('readKey', () => {
  test('should read excel keys', async () => {
    const keys = await readKey(dataPaths.key)

    if (!keys) fail()

    expect(keys.length).toBeGreaterThanOrEqual(1)
    expect(keys[0]).toMatchSnapshot({
      id: expect.any(String),
    })
  })

  test('should read image keys', async () => {
    const keys = await readKey(dataPaths.keyImage)

    if (!keys) fail()

    expect(keys.length).toBe(1)
    expect(keys[0]).toMatchSnapshot({
      id: expect.any(String),
      filePath: expect.anything(),
    })
  })
})
