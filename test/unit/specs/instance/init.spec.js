import Formotor from 'src/index'

describe('formotor init', () => {
  test('init', () => {
    const fm = new Formotor()

    expect(fm instanceof Formotor).toBe(true)
  })
})
