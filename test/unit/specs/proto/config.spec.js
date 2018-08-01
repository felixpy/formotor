import Formotor from 'src/index'

describe('set and get config', () => {
  test('empty options', () => {
    Formotor.setConfig()

    expect(Formotor.getConfig().postName).toBe('data-post-name')
  })

  test('object options', () => {
    Formotor.setConfig({
      postName: 'jz-post-name'
    })

    expect(Formotor.getConfig().postName).toBe('jz-post-name')
  })

  test('single key', () => {
    Formotor.setConfig('postName', 'jz-post-name')

    expect(Formotor.getConfig('postName')).toBe('jz-post-name')
  })
})
