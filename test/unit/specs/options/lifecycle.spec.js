import Formotor from 'src/index'

describe('formotor lifecycles', () => {
  test('init', () => {
    const fm = new Formotor()

    expect(fm instanceof Formotor).toBe(true)
  })
})
