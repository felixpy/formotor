import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('formotor jquery/zepto event options', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty().append(`
      <div fm-app>
        <input type="text" name="a" class="j-alfa"></>
        <input type="text" name="b" class="j-bravo"></>
        <input type="text" name="c" class="j-bravo"></>
      </div>
    `)
  })

  test('proxy', () => {
    const smile = jest.fn(function () {
      this.emotion = this.emotion + 1
    })
    const cry = jest.fn(function () {
      this.emotion = this.emotion + 2
    })
    const anger = jest.fn(function () {
      this.emotion = this.emotion + 3
    })
    const comp = new Formotor({
      el: '[fm-app]',
      proxies: {
        'change .j-alfa': 'smile',
        'change .j-bravo': 'cry',
        'change|keyup .j-bravo': 'cry',
        'change|focus .j-bravo': 'anger'
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

    comp.$find('.j-alfa').trigger('change')

    expect(comp.emotion).toBe(1)

    comp.$find('.j-bravo:first').trigger('change')

    expect(comp.emotion).toBe(8)

    comp.$find('.j-bravo:first').trigger('keyup')

    expect(comp.emotion).toBe(10)

    comp.$find('.j-bravo:last').trigger('focus')

    expect(comp.emotion).toBe(13)
  })
})
