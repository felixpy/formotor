import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('fm-on directive', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('bind', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div id="foo" fm-on:click.alfa="doSomeThing" fm-on:click.bravo="doSomeThingElse"></div>
        <div id="bar" fm-on:click="doSomeThing"></div>
        <div id="zoo" fm-on:click.alfa="doSomeThing" fm-on:click.bravo="doSomeThingElse" fm-on:click.charlie="doSomeThingElse"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing ($event) {
          this.x = this.x + 3

          expect($event.type).toBe('click')
        },
        doSomeThingElse () {
          this.x = this.x + 7
        }
      }
    })

    comp.$find('#foo').trigger('click')

    expect(comp.x).toBe(10)

    comp.$find('#bar').trigger('click')

    expect(comp.x).toBe(13)

    comp.$find('#zoo').trigger('click')

    expect(comp.x).toBe(30)
  })

  test('shorthand', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" @click="doSomeThing"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing () {
          this.x = this.x + 1
        }
      }
    })

    comp.$find('.j-foo').trigger('click')

    expect(comp.x).toBe(1)
  })

  test('repeated', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" @click.foo="doSomeThing" @click.bar="doSomeThing"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing () {
          this.x = this.x + 1
        }
      }
    })

    comp.$find('.j-foo').trigger('click')

    expect(comp.x).toBe(1)
  })

  test('statement', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" @click="doSomeThing(5, 8, $event)"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0,
        y: 0
      },
      methods: {
        doSomeThing (x, y, $event) {
          this.x = x
          this.y = y
          expect($event.type).toBe('click')
        }
      }
    })

    comp.$find('.j-foo').trigger('click')

    expect(comp.x).toBe(5)
    expect(comp.y).toBe(8)
  })

  test('proxy', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" fm-on:click="doSomeThing"></div>
        <div class="j-foo"></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing () {
          this.x = this.x + 1
        }
      }
    })

    comp.$find('.j-foo:first').trigger('click')

    expect(comp.x).toBe(1)

    comp.$find('.j-foo:last').trigger('click')

    expect(comp.x).toBe(2)
  })

  test('stop propagation', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" fm-on:click="foo">
          <div class="j-bar" fm-on:click.stop="bar"></div>
          <div class="j-zoo" fm-on:click="zoo"></div>
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        foo () {
          this.x = this.x + 1
        },
        bar () {
          this.x = this.x + 3
        },
        zoo () {
          this.x = this.x + 5
        }
      }
    })

    comp.$find('.j-bar').trigger('click')

    expect(comp.x).toBe(3)

    comp.$find('.j-zoo').trigger('click')

    expect(comp.x).toBe(9)
  })

  test('prevent default', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <input type="checkbox" value="1" name="foo" @click.prevent="doSomeThing">
        <input type="checkbox" value="2" name="bar" @click="doSomeThing">
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing () {}
      }
    })

    comp.$find(':checkbox').trigger('click')

    const values = comp.$get()

    expect(values.foo).toBeUndefined()
    expect(values.bar).toEqual(['2'])
  })

  test('modifier self', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" fm-on:click.self="doSomeThing">
          <div class="j-bar"></div>
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      },
      methods: {
        doSomeThing () {
          this.x = this.x + 1
        }
      }
    })

    comp.$find('.j-bar').trigger('click')

    expect(comp.x).toBe(0)

    comp.$find('.j-foo').trigger('click')

    expect(comp.x).toBe(1)
  })

  test('modifier keycode', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <input type="text" class="j-foo" fm-on:keyup.left="doSomeThing" />
        <input type="text" class="j-bar" fm-on:keyup.delete="doSomeThingElse" />
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0,
        y: 0
      },
      methods: {
        doSomeThing () {
          this.x = this.x + 1
        },
        doSomeThingElse () {
          this.y = this.y - 1
        }
      }
    })

    comp.$find('.j-foo').trigger(JZ.Event('keyup', {
      keyCode: 39
    }))

    expect(comp.x).toBe(0)

    comp.$find('.j-foo').trigger(JZ.Event('keyup', {
      keyCode: 37
    }))

    expect(comp.x).toBe(1)

    comp.$find('.j-bar').trigger(JZ.Event('keyup', {
      keyCode: 9
    }))

    expect(comp.y).toBe(0)

    comp.$find('.j-bar').trigger(JZ.Event('keyup', {
      keyCode: 8
    }))

    expect(comp.y).toBe(-1)
  })

  test('handler not exist', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div class="j-foo" fm-on:click="abc def"></div>
        <div class="j-bar" fm-on:click.xyz></div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data: {
        x: 0
      }
    })

    comp.$find('.j-foo').trigger('click')
    comp.$find('.j-bar').trigger('click')

    expect(comp.x).toBe(0)
  })
})
