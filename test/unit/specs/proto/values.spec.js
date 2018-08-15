import Formotor from 'src/index'

const JZ = Formotor.JZ

describe('inexistent api', () => {
  test('inexistent api', () => {
    const JZInput = JZ(`
      <input type="text" name="alfa" value="2018">
    `)

    expect(JZInput.formotor('getSomeValue')).toBe(JZInput)
    expect(JZInput.formotor({})).toBe(JZInput)
  })
})

describe('set and get value', () => {
  test('simply', () => {
    const JZInput = JZ(`
      <input type="text" name="alfa" value="2018">
    `)

    expect(JZInput.formotor('getValue')).toBe('2018')

    JZInput.formotor('setValue', 2080)
    expect(JZInput.formotor('getValue')).toBe('2080')
  })

  test('checkbox', () => {
    const JZInput = JZ(`
      <div>
        <input type="checkbox" checked name="alfa" value="a1">
        <input type="checkbox" checked name="alfa" value="a2">
      </div>
    `).find(':checkbox')

    expect(JZInput.formotor('getValue')).toEqual(['a1', 'a2'])

    JZInput.formotor('setValue', 'a1')
    expect(JZInput.formotor('getValue')).toEqual(['a1'])

    JZInput.formotor('setValue', ['a2'])
    expect(JZInput.formotor('getValue')).toEqual(['a2'])
  })

  test('checkbox', () => {
    const JZInput = JZ(`
      <div>
        <input type="text" name="alfa" value="a1">
        <input type="text" name="alfa" value="a2">
      </div>
    `).find(':text')

    expect(JZInput.formotor('getValue')).toEqual(['a1', 'a2'])
  })
})

describe('set and get form values', () => {
  test('simply', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa" value="2018">
      </form>
    `)

    expect(JZForm.formotor('getValues').alfa).toBe('2018')

    JZForm.formotor('setValues', {
      alfa: '2080'
    })
    expect(JZForm.formotor('getValues').alfa).toBe('2080')

    JZForm.formotor('setValues')
    expect(JZForm.formotor('getValues').alfa).toBe('2080')
  })

  test('post name', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa" data-post-name="foo" value="2018">
        <input type="text" data-post-name="bar" value="2020">
      </form>
    `)

    expect(JZForm.formotor('getValues').foo).toBe('2018')
    expect(JZForm.formotor('getValues').bar).toBe('2020')

    JZForm.formotor('setValues', {
      foo: '3018',
      bar: '3020'
    })

    expect(JZForm.formotor('getValues').foo).toBe('3018')
    expect(JZForm.formotor('getValues').bar).toBe('3020')
  })

  test('ignore', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" class="fm-ignore" name="alfa" value="2018">
      </form>
    `)

    expect(JZForm.formotor('getValues').alfa).toBeUndefined()
  })

  test('disabled', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" disabled class="fm-accessible" name="alfa" value="2018">
        <input type="text" disabled name="bravo" value="2020">
      </form>
    `)

    expect(JZForm.formotor('getValues').alfa).toBe('2018')
    expect(JZForm.formotor('getValues').bravo).toBeUndefined()
    expect(JZForm.formotor('getValues', {}, {
      disableMode: true
    }).bravo).toBe('2020')
  })

  test('middlewares', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa" value="2018 ">
        <input type="checkbox" checked name="bravo" value=" b1">
        <input type="checkbox" checked name="bravo" value="b2 ">
        <select name="charlie" multiple>
          <option value="c1 " selected>A</option>
          <option value=" c2" selected>B</option>
        </select>
        <input type="text" name="delta" value="empty">
      </form>
    `)
    const config = {
      middlewares: {
        trim: {
          'textarea,[type=text]': false
        },
        postfix: {
          '[name=alfa],[name=bravo],[name=charlie]': function (value) {
            return value + '@foo'
          }
        },
        emptyValue: {
          '[name=delta]': function () {
            return null
          }
        }
      }
    }
    const values = JZForm.formotor('getValues', {}, config)
    expect(values.alfa).toBe('2018 @foo')
    expect(values.bravo).toEqual([' b1@foo', 'b2 @foo'])
    expect(values.charlie).toEqual(['c1 @foo', ' c2@foo'])
    expect(values.delta).toBeUndefined()
  })

  test('duplicated name', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa" value="2018">
        <input type="text" name="alfa" value="2020">
      </form>
    `)

    expect(JZForm.formotor('getValues').alfa).toEqual(['2018', '2020'])
  })

  test('get custom values', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa" value="2018,2020">
        <div>
          <input type="hidden" name="bravo">
          <span class="widget">b1</span>
        </div>
        <input type="text" name="charlie" value="c1">
        <input type="text" name="delta" value="d1">
      </form>
    `)
    const options = {
      'alfa': function () {
        return JZ(this).val().split(',')
      },
      'bravo': function (JZForm, referValues) {
        return JZ(this).closest('div').find('span').text() + referValues.charlie
      },
      'charlie': 'invalid opt',
      'delta': function () {
        return null
      }
    }
    const values = JZForm.formotor('getValues', options)

    expect(values.alfa).toEqual(['2018', '2020'])
    expect(values.bravo).toBe('b1c1')
    expect(values.charlie).toBe('c1')
    expect(values.delta).toBe('d1')
  })

  test('set custom values', () => {
    const JZForm = JZ(`
      <form>
        <input type="text" name="alfa">
        <input type="text" name="bravo">
      </form>
    `)
    const options = {
      'alfa': function (JZForm, value, values) {
        JZ(this).val(value).attr('data-id', values.alfaId)
      },
      // without value
      'bravo': function (JZForm, value) {
        JZ(this).val('2050')
      }
    }

    JZForm.formotor('setValues', {
      alfa: '2018',
      alfaId: '100'
    }, options)

    expect(JZForm.formotor('getValues').alfa).toEqual('2018')
    expect(JZForm.formotor('getValues').bravo).toEqual('2050')
    expect(JZForm.find('[name=alfa]').attr('data-id')).toBe('100')
  })

  test('without form', () => {
    const JZFakeForm = JZ(`
      <div>
        <input type="text" name="alfa" value="2018">
      </div>
    `)
    const options = {
      'alfa': function () {
        return JZ(this).val() + '@alfa'
      }
    }
    const values = JZFakeForm.formotor('getValues', options)

    expect(values.alfa).toBe('2018@alfa')
  })
})
