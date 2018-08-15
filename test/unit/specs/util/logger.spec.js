import * as utils from 'src/util'

describe('logger utils', () => {
  test('warn', () => {
    const warn = jest.fn(utils.warn)

    warn('foobar')

    expect(utils.warn).toBeDefined()
    expect(warn).toBeCalledWith('foobar')
  })
})
