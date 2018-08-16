import Formotor from 'src/index'

describe('set and get config', () => {
  test('empty options', () => {
    expect(Formotor.config()).toBeUndefined()
  })

  test('object options', () => {
    Formotor.config({
      baseComponent: 'my-component',
      _eventSeparator: '+'
    })

    expect(Formotor.config('baseComponent')).toBe('my-component')
    expect(Formotor.config('_eventSeparator')).toBeUndefined()
  })

  test('single key', () => {
    Formotor.config('baseComponent', 'my-component')

    expect(Formotor.config('baseComponent')).toBe('my-component')
  })

  test('private key', () => {
    Formotor.config('_eventSeparator', '+')

    expect(Formotor.config('_eventSeparator')).toBeUndefined()
  })
})
