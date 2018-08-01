import * as utils from 'src/util'

describe('shared utils', () => {
  test('includes', () => {
    const arr = [1, 2, 4, '6']

    expect(utils.includes(arr, 1)).toBe(true)
    expect(utils.includes(arr, 6)).toBe(false)
  })

  test('is object', () => {
    const obj = {}
    const arr = []
    const num = 1

    expect(utils.isObject(obj)).toBe(true)
    expect(utils.isObject(arr)).toBe(true)
    expect(utils.isObject(num)).toBe(false)
  })

  test('is array', () => {
    const obj = {}
    const arr = []
    const num = 1

    expect(utils.isArray(obj)).toBe(false)
    expect(utils.isArray(arr)).toBe(true)
    expect(utils.isArray(num)).toBe(false)
  })

  test('is string', () => {
    const str = '1'
    const num = 1

    expect(utils.isString(str)).toBe(true)
    expect(utils.isString(num)).toBe(false)
  })

  test('is function', () => {
    const fun = function () {}
    const obj = {}

    expect(utils.isFunction(fun)).toBe(true)
    expect(utils.isFunction(obj)).toBe(false)
  })

  test('is undefined', () => {
    const undef = undefined
    const nullValue = null

    expect(utils.isUndef(undef)).toBe(true)
    expect(utils.isUndef(nullValue)).toBe(false)
  })

  test('has key', () => {
    const obj = {
      foo: 1
    }

    expect(utils.hasKey(obj, 'foo')).toBe(true)
    expect(utils.hasKey(obj, 'bar')).toBe(false)
  })

  test('to array', () => {
    const arr = {
      0: 2,
      1: 4,
      length: 2
    }

    expect(utils.toArray(arr)).toEqual([2, 4])
  })
})
