import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('formotor render', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('components and directives', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="alfa">
          <div fm-greet="'hello'"></div>
          <div fm-on:click="doSomeThing"></div>
        </div>
        <div fm-component="bravo">
        </div>
      </div>
    `)
    const greetBind = jest.fn(function (el, bindings, comp) {
      expect(bindings.value).toBe('hello')
    })
    const comp = new Formotor({
      el: '[fm-app]',
      components: {
        'alfa': {
          data: {
            x: 1
          },
          methods: {
            doSomeThing () {}
          }
        }
      },
      directives: {
        'greet': greetBind
      }
    })

    expect(comp).not.toBeNull()
    expect(greetBind).toHaveBeenCalledTimes(1)
  })
})
