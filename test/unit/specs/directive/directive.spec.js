import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('directive features', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('bind', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-foo="1"></div>
      </div>
    `)
    Formotor.directive('foo', {
      bind (el, bindings, comp) {
        comp.x = bindings.value
      }
    })
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      }
    })

    expect(comp.x).toBe(1)
  })

  test('args', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-foo:add="3"></div>
        <div fm-foo:minus="10"></div>
        <div fm-foo:a:b="20"></div>
      </div>
    `)
    Formotor.directive('foo', {
      bind (el, bindings, comp) {
        if (bindings.arg === 'minus') {
          comp.x = comp.x - bindings.value
        } else {
          comp.x = comp.x + bindings.value
        }
      }
    })
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      }
    })

    expect(comp.x).toBe(13)
  })

  test('modifiers', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-foo.trim.upper="' text  '"></div>
      </div>
    `)
    Formotor.directive('foo', {
      bind (el, bindings, comp) {
        const modifiers = bindings.modifiers
        let value = bindings.value

        expect(modifiers.trim).toBeTruthy()
        expect(modifiers.upper).toBeTruthy()

        if (modifiers.trim) {
          value = String(value).trim()
        }

        if (modifiers.upper) {
          value = String(value).toUpperCase()
        }

        comp.x = value
      }
    })
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      }
    })

    expect(comp.x).toBe('TEXT')
  })
})
