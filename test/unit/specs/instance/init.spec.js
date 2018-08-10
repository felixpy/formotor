import Formotor from 'src/index'

describe('formotor init', () => {
  test('init', () => {
    const comp = new Formotor()

    expect(comp instanceof Formotor).toBe(true)
  })
})
