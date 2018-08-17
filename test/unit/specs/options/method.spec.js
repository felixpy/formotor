import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('component methods', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app></div>
    `)
  })

  test('context', () => {
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing (x) {
          expect(this).toBe(comp)
          this.x = x
        }
      }
    })

    comp.doSomeThing(3)

    expect(comp.x).toBe(3)
  })
})
