import Formotor from 'src/index'

describe('formotor global apis', () => {
  test('component', () => {
    Formotor.component('my-component', {
      data: {
        x: 1
      }
    })
    const componentOptions = Formotor.component('my-component')

    expect(componentOptions.data).toEqual({
      x: 1
    })
  })

  test('directive', () => {
    const bindFN = jest.fn(function () {
      console.log('bind')
    })

    expect(Formotor.directive('my-directive')).toBeUndefined()

    Formotor.directive('my-directive', {
      bind: bindFN
    })

    expect(Formotor.directive('my-directive').bind).toBe(bindFN)
  })

  test('extend', () => {
    const source = {
      data: {
        x: 1,
        y: 2
      }
    }
    const dest = {
      data: {
        x: 3
      }
    }

    const deepExtend = Formotor.extend(source, dest, true)
    const deepExtend2 = Formotor.extend(source, dest)
    const shallowExtend = Formotor.extend(source, dest, false)

    expect(deepExtend.data.x).toBe(3)
    expect(deepExtend.data.y).toBe(2)
    expect(deepExtend2.data.x).toBe(3)
    expect(deepExtend2.data.y).toBe(2)

    expect(shallowExtend.data.x).toBe(3)
    expect(shallowExtend.data.y).toBeUndefined()
  })
})
