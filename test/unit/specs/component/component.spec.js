import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('component features', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('registry', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo"></div>
      </div>
    `)
    Formotor.component('foo', {
      data () {
        return {
          x: 1
        }
      }
    })
    const comp = new Formotor({
      el: '[fm-app]'
    })

    expect(comp.$children[0].x).toBe(1)
  })

  test('basic', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="bar"></div>
      </div>
    `)
    Formotor.component('basic', {
      data () {
        return {
          x: 2
        }
      }
    })
    const comp = new Formotor({
      el: '[fm-app]'
    })

    expect(comp.$children[0].x).toBe(2)
  })

  test('nested', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="alfa">
          <div fm-component="bravo">
            <div fm-component="charlie">
            </div>
          </div>
        </div>
      </div>
    `)
    Formotor.component('basic', {
      data () {
        return {
          x: 10
        }
      }
    })
    Formotor.component('charlie', {
      data () {
        return {
          x: 20
        }
      }
    })
    const comp = new Formotor({
      el: '[fm-app]'
    })

    expect(comp.$children[0].x).toBe(10)
    expect(comp.$children[0].$children[0].x).toBe(10)
    expect(comp.$children[0].$children[0].$children[0].x).toBe(20)
  })
})
