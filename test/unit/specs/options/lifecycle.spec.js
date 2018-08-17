import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('lifecycle callbacks', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app></div>
    `)
  })

  test('init', () => {
    const comp = new Formotor({
      el: '[fm-app]',
      events: {
        'hook:init': 'doSomeThing'
      },
      data: {
        x: 0,
        y: 0
      },
      init () {
        this.doSomeThingElse()
      },
      methods: {
        doSomeThing () {
          this.x = 1
        },
        doSomeThingElse () {
          this.y = 2
        }
      }
    })

    expect(comp.x).toBe(1)
    expect(comp.y).toBe(2)
  })

  test('ready', () => {
    const comp = new Formotor({
      el: '[fm-app]',
      events: {
        'hook:ready': 'doSomeThing'
      },
      data: {
        x: 0,
        y: 0
      },
      ready () {
        this.doSomeThingElse()
      },
      methods: {
        doSomeThing () {
          this.x = 1
        },
        doSomeThingElse () {
          this.y = 2
        }
      }
    })

    expect(comp.x).toBe(1)
    expect(comp.y).toBe(2)
  })
})
