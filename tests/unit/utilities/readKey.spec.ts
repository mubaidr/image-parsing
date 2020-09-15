import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'

describe('readKey', () => {
  test('should read excel keys', async () => {
    const results = await readKey(dataPaths.key)
    if (!results) return

    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0]).toMatchSnapshot({
      id: expect.any(String),
    })
  })

  test('should read image keys', async () => {
    const results = await readKey(dataPaths.keyImage)
    if (!results) return

    expect(results.length).toBe(1)
    expect(results[0]).toMatchSnapshot({
      id: expect.any(String),
      imageFile: expect.anything(),
    })
  })
})
