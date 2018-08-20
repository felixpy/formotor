import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('data options', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app></div>
    `)
  })

  test('return entire data with function', () => {
    const comp = new Formotor({
      el: '[fm-app]',
      data () {
        return {
          x: 1,
          y: 2,
          z: 3
        }
      }
    })

    expect(comp.z).toBe(3)
  })

  test('return each key of data with function', () => {
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x () {
          return 10
        },
        y () {
          return 30
        }
      }
    })

    expect(comp.y).toBe(30)
  })
})
