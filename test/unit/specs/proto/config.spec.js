import Formotor from 'src/index'

describe('set config by object', () => {
  test('setConfig/getConfig', () => {
    Formotor.setConfig({
      postNameAttr: 'jz-post-name'
    })

    expect(Formotor.getConfig().postNameAttr).toBe('jz-post-name')
  })
})
