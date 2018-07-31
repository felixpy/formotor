import Formotor from 'src/index'

describe('set and get config', () => {
  test('object option', () => {
    Formotor.setConfig({
      postNameAttr: 'jz-post-name'
    })

    expect(Formotor.getConfig().postNameAttr).toBe('jz-post-name')
  })
})
