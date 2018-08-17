import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('component options', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('component option', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <div fm-component="foo"></div>
          <div fm-component="foo">
            <div fm-component="bar">
              <div fm-component="zoo"></div>
            </div>
          </div>
        </div>
        <div fm-component="bar">
          <div fm-component="zoo"></div>
        </div>
      </div>
    `)
    let fooNum = 1
    let barNum = 1
    const comp = new Formotor({
      el: '[fm-app]',
      components: {
        foo: {
          data () {
            return {
              x: fooNum++
            }
          },
          components: {
            zoo: {
              data () {
                return {
                  z: 100
                }
              }
            }
          }
        },
        bar: {
          data () {
            return {
              y: barNum++
            }
          }
        }
      }
    })

    expect(comp.$children[0].x).toBe(1)
    expect(comp.$children[0].$children[0].x).toBe(2)
    expect(comp.$children[0].$children[1].x).toBe(3)
    expect(comp.$children[0].$children[1].$children[0].y).toBe(1)
    expect(comp.$children[0].$children[1].$children[0].$children[0].z).toBe(100)
    expect(comp.$children[1].y).toBe(2)
    expect(comp.$children[1].$children[0].z).toBeUndefined()
  })
})
