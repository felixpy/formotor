import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('formotor event', () => {
  let comp

  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app></div>
    `)

    comp = new Formotor({
      el: '[fm-app]'
    })
  })

  test('$on', () => {
    const cb1 = jest.fn(function (x, y) {
      expect(this).toBe(comp)
    })
    const cb2 = jest.fn(function (x, y) {})

    comp.$on('foo', cb1)
    comp.$on('foo', cb2)

    comp.$trigger('foo', 1, 2)

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb1).toHaveBeenCalledWith(1, 2)
    expect(cb2).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledWith(1, 2)
  })

  test('$once', () => {
    const cb = jest.fn(function () {})

    comp.$once('foo', cb)

    comp.$trigger('foo')
    comp.$trigger('foo')

    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('$off', () => {
    const cb = jest.fn(function () {})
    comp.$on('foo', cb)
    comp.$on('bar', cb)
    comp.$off()
    comp.$trigger('foo')
    comp.$trigger('bar')

    expect(cb).not.toHaveBeenCalled()
  })

  test('$off event', () => {
    const cb = jest.fn(function () {})
    comp.$on('foo', cb)
    comp.$on('bar', cb)
    comp.$off('bar')
    comp.$off('bar')
    comp.$trigger('foo', 10)
    comp.$trigger('foo', 20)
    comp.$trigger('foo', 30)
    comp.$trigger('bar', 50)

    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenLastCalledWith(30)
  })

  test('$off event + fn', () => {
    const cb1 = jest.fn(function () {})
    const cb2 = jest.fn(function () {})
    comp.$on('foo', cb1)
    comp.$on('foo', cb2)
    comp.$off('foo', cb1)
    comp.$trigger('foo', 10)

    expect(cb1).not.toHaveBeenCalled()
    expect(cb2).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledWith(10)
  })

  test('$listen and $broadcast', () => {
    JZ('.wrapper').empty().append(`
      <div fm-app>
        <div fm-component="a"></div>
        <div fm-component="b"></div>
      </div>
    `)
    const childCB1 = jest.fn(function () {})
    const childCB2 = jest.fn(function () {})
    const compTree = new Formotor({
      el: '[fm-app]',
      ready () {
        this.$broadcast('root:someEvent', 1, 3)
      },
      components: {
        a: {
          init () {
            this.$listen('root:someEvent', childCB1)
            this.$listen('b:someEventOfB', childCB1)
          }
        },
        b: {
          init () {
            this.$listen('root:someEvent', childCB2)
          },
          ready () {
            this.$broadcast('b:someEventOfB')
          }
        }
      }
    })
    compTree.$broadcast('root:someOtherEvent')

    expect(childCB1).toHaveBeenCalledTimes(2)
    expect(childCB2).toHaveBeenCalledTimes(1)
    expect(childCB2).toHaveBeenCalledWith(1, 3)
  })
})
