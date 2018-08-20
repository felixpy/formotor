import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('event options', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app></div>
    `)
  })

  test('event callbacks', () => {
    const smile = jest.fn(function () {
      this.emotion = 233
    })
    const cry = jest.fn(function () {
      this.emotion = 555
    })
    const anger = jest.fn(function () {
      this.emotion = 777
    })
    const comp = new Formotor({
      el: '[fm-app]',
      events: {
        'act:smile': 'smile',
        'act:cry': ['cry', 'anger']
      },
      data: {
        emotion: 0
      },
      methods: {
        smile,
        cry,
        anger
      }
    })

    expect(comp.emotion).toBe(0)

    comp.$trigger('act:smile')

    expect(smile).toHaveBeenCalledTimes(1)
    expect(comp.emotion).toBe(233)

    comp.$trigger('act:cry')

    expect(cry).toHaveBeenCalledTimes(1)
    expect(anger).toHaveBeenCalledTimes(1)
    expect(comp.emotion).toBe(777)
  })
})
