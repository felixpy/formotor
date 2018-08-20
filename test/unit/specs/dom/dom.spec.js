import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('dom apis', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('$find', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="container">
          <div fm-component="foo">
            <div class="j-foo-tags">1</div>
            <div class="j-foo-tags">2</div>
            <div class="j-foo-tags">3</div>
          </div>
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      components: {
        foo: {
          reday () {
            expect(this.$find('.j-foo-tags').length).toBe(3)
          }
        }
      }
    })

    expect(comp.$find('.container').length).toBe(1)
  })
})
