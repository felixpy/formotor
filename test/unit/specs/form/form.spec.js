import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('form operations', () => {
  JZ('<div class="wrapper"></div>').appendTo('body')
  beforeEach(() => {
    JZ('.wrapper').empty()
  })

  test('$get', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="alfa" value="1" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bravo" value="2" />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]'
    })
    const data = comp.$get()

    expect(data.alfa).toBe('1')
    expect(data.bravo).toBe('2')
  })

  test('$set', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="alfa" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bravo" />
          <input type="checkbox" checked name="charlie" value="c1" />
          <input type="checkbox" name="charlie" value="c2" />
          <input type="text" value="10" />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data () {
        return {
          model: {
            alfa: 10,
            bravo: 20,
            charlie: 'c1'
          }
        }
      }
    })

    comp.$set()
    let data = comp.$get()

    expect(data.alfa).toBe('10')
    expect(data.bravo).toBe('20')
    expect(data.charlie).toEqual(['c1'])

    comp.$set({
      alfa: 30,
      bravo: 50,
      charlie: 'c2'
    })
    data = comp.$get()
    expect(data.alfa).toBe('30')
    expect(data.bravo).toBe('50')
    expect(data.charlie).toEqual(['c2'])
  })

  test('$set with empty data', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="alfa" value="1" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bravo" value="2" />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data () {
        return {
          model: null
        }
      }
    })

    comp.$set()
    let data = comp.$get()

    expect(comp.model).toEqual({})
    expect(data.alfa).toBe('1')
    expect(data.bravo).toBe('2')
  })

  test('custom handler to get values', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="alfa" value="  1  " />
        </div>
        <div fm-component="bar">
          <input type="text" name="bravo" value="  2  " />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      components: {
        foo: {
          methods: {
            getValues (data) {
              return this.$getValues({
                alfa () {
                  return JZ(this).val() + '@postfix'
                }
              }, {
                trimText: false
              })
            }
          }
        },
        bar: {
          methods: {
            getValues (data) {
              return this.$getValues({
                bravo (JZCompEL, referValues) {
                  return 'prefix@' + referValues.bravo
                }
              })
            }
          }
        }
      }
    })

    comp.$set()
    let data = comp.$get()

    expect(data.alfa).toBe('  1  @postfix')
    expect(data.bravo).toBe('prefix@2')
  })

  test('custom handler to set values', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="alfa" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bravo" />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      data () {
        return {
          model: {
            alfa: 10,
            bravo: 20,
            charlie: 'c1'
          }
        }
      },
      components: {
        foo: {
          methods: {
            setValues (data) {
              this.$setValues(data, {
                alfa (JZCompEL, value, data) {
                  JZ(this).val(value + 80)
                }
              })
            }
          }
        },
        bar: {
          methods: {
            setValues (data) {
              this.$setValues(data, {
                bravo (JZCompEL, value, data) {
                  JZ(this).val(value + 100)
                },
                charlie () {}
              })
            }
          }
        }
      }
    })

    comp.$set()
    let data = comp.$get()

    expect(data.alfa).toBe('90')
    expect(data.bravo).toBe('120')
  })

  test('references', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <div fm-component="foo">
          <input type="text" name="foo" value="1" />
        </div>
        <div fm-component="bar">
          <input type="text" name="bar" value="2" />
        </div>
        <div fm-component="zoo">
          <input type="text" name="zoo" value="3" />
        </div>
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      ready () {
        const fooValue = this.$callRef('foo')
        const barValues = this.$callRef('bar', true)
        const zooValues = this.$callRef('zoo', true)
        const someValues = this.$callRef('some', true)

        expect(fooValue).toBe('1')
        expect(barValues.bar).toBe('2')
        expect(zooValues.zoo).toBeUndefined()
        expect(zooValues.zooStatus).toBeTruthy()
        expect(someValues).toBeUndefined()
      },
      components: {
        zoo: {
          methods: {
            provideRef () {
              const values = this.$get()
              return {
                zooStatus: values.zoo === '3'
              }
            }
          }
        }
      }
    })
    const data = comp.$get()

    expect(data.zoo).toBe('3')
    expect(data.zooStatus).toBeUndefined()
  })

  test('disable component', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <input type="text" name="alfa" value="1" />
        <input type="text" name="bravo" value="2" />
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      methods: {
        setDisabledValues () {
          this.$setValues({
            alfa: 10
          })
        },
        getDisabledValues () {
          return this.$getValues({}, {
            ignore: '[name=bravo]'
          })
        }
      }
    })
    let data

    comp.$disable(false)
    data = comp.$get()

    expect(comp.$disable()).toBeFalsy()
    expect(data.alfa).toBe('1')
    expect(data.bravo).toBe('2')

    comp.$disable(true)

    expect(comp.$disable()).toBeTruthy()

    data = comp.$get()

    expect(data.alfa).toBe('1')
    expect(data.bravo).toBeUndefined()

    comp.$set()
    data = comp.$get()

    expect(data.alfa).toBe('10')
    expect(data.bravo).toBeUndefined()
  })

  test('disable form elements', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <input type="text" name="alfa" />
        <input type="text" name="bravo" />
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]'
    })
    const JZAlfa = comp.$find('[name=alfa]')
    const JZBravo = comp.$find('[name=bravo]')

    comp.$disableFormElements()

    expect(JZAlfa.prop('disabled')).toBeTruthy()
    expect(JZBravo.prop('disabled')).toBeTruthy()

    comp.$disableFormElements(false)

    expect(JZAlfa.prop('disabled')).toBeFalsy()
    expect(JZBravo.prop('disabled')).toBeFalsy()

    comp.$disableFormElements(true, '[name=alfa]')

    expect(JZAlfa.prop('disabled')).toBeTruthy()
    expect(JZBravo.prop('disabled')).toBeFalsy()

    comp.$disableFormElements()
    comp.$disableFormElements(false, '[name=bravo]')

    expect(JZAlfa.prop('disabled')).toBeTruthy()
    expect(JZBravo.prop('disabled')).toBeFalsy()
  })

  test('disable form elements with custom method', () => {
    JZ('.wrapper').append(`
      <div fm-app>
        <input type="text" name="alfa" />
        <input type="text" name="bravo" />
      </div>
    `)
    const comp = new Formotor({
      el: '[fm-app]',
      methods: {
        disableFormElements () {
          this.$find('[name=bravo]').prop('disabled', true)
        }
      }
    })
    const JZAlfa = comp.$find('[name=alfa]')
    const JZBravo = comp.$find('[name=bravo]')

    comp.$disableFormElements()

    expect(JZAlfa.prop('disabled')).toBeFalsy()
    expect(JZBravo.prop('disabled')).toBeTruthy()
  })
})
