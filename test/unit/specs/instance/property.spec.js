import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('formotor instance properties', () => {
  let comp
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div id="app" fm-app>
        <div fm-component="foo">
          <input type="text" name="foo" value="1" />
          <input type="text" name="fooStatus" value="success" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bar" value="2" />
        </div>
      </div>
    `)
    comp = new Formotor({
      el: '[fm-app]',
      components: {
        foo: {},
        bar: {}
      }
    })
  })

  test('$el', () => {
    expect(comp.$el.length).toBe(1)
    expect(comp.$el.get(0).id).toBe('app')
  })

  test('$parent', () => {
    expect(comp.$parent).toBeNull()
    expect(comp.$children[0].$parent).toBe(comp)
    expect(comp.$children[1].$parent).toBe(comp)
  })

  test('$root', () => {
    expect(comp.$root).toBe(comp)
    expect(comp.$children[0].$root).toBe(comp)
    expect(comp.$children[1].$root).toBe(comp)
  })

  test('$name', () => {
    expect(comp.$name).toBeUndefined()
    expect(comp.$children[0].$name).toBe('foo')
    expect(comp.$children[1].$name).toBe('bar')
  })

  test('$primary', () => {
    const JZFooPrimary = comp.$children[0].$primary
    const JZBarPrimary = comp.$children[1].$primary

    expect(JZFooPrimary.length).toBe(1)
    expect(JZBarPrimary.length).toBe(1)
    expect(JZFooPrimary.val()).toBe('1')
    expect(JZBarPrimary.val()).toBe('2')
  })
})
