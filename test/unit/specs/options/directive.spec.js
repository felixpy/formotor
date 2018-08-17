import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('directive options', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('directive option', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-foo="1"></div>
        <div fm-bar="2"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0,
        y: 0
      },
      directives: {
        foo (el, bindings, comp) {
          comp.x = bindings.value
        },
        bar: {
          bind (el, bindings, comp) {
            comp.y = bindings.value
          }
        }
      }
    })

    expect(comp.x).toBe(1)
    expect(comp.y).toBe(2)
  })

  test('directive with subcomponent', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-foo="1" fm-component="alfa">
          <div fm-foo="2" fm-zoo="4"></div>
        </div>
        <div fm-component="bravo">
          <div fm-bar="3" fm-zoo="6"></div>
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      directives: {
        foo (el, bindings, comp) {
          comp.x = bindings.value
        },
        bar: {
          bind (el, bindings, comp) {
            comp.y = bindings.value
          }
        }
      },
      components: {
        alfa: {
          directives: {
            zoo (el, bindings, comp) {
              comp.z = bindings.value
            }
          }
        }
      }
    })

    expect(comp.x).toBe(1)
    expect(comp.$children[0].x).toBe(2)
    expect(comp.$children[0].z).toBe(4)
    expect(comp.$children[1].y).toBe(3)
    expect(comp.$children[1].z).toBeUndefined()
  })
})
