import Formotor from 'src/index'

describe('set and get global config of prototype apis', () => {
  test('empty options', () => {
    Formotor.setProtoConfig()

    expect(Formotor.getProtoConfig().postName).toBe('data-post-name')
  })

  test('object options', () => {
    Formotor.setProtoConfig({
      postName: 'jz-post-name'
    })

    expect(Formotor.getProtoConfig().postName).toBe('jz-post-name')
  })

  test('single key', () => {
    Formotor.setProtoConfig('postName', 'jz-post-name')

    expect(Formotor.getProtoConfig('postName')).toBe('jz-post-name')
  })
})
