import * as utils from 'src/util'

describe('component option utils', () => {
  test('merge options', () => {
    const parentOptions = {
      directives: {
        foo: function () {}
      },
      components: {
        bar: {}
      }
    }
    const childOptions = {
      components: {
        zoo: {}
      }
    }
    const mergedOptions = utils.mergeOptions(parentOptions, childOptions)

    expect(mergedOptions.directives.foo.bind).toBeDefined()
    expect(mergedOptions.components.bar).toBeDefined()
  })

  test('resolve asset', () => {
    const fooDirective = function () {}
    const options = {
      directives: {
        foo: fooDirective
      },
      components: {
        bar: {
          data: {
            x: 1
          }
        }
      }
    }

    expect(utils.resolveAsset(options, 'directive', 'foo')).toBe(fooDirective)
    expect(utils.resolveAsset(options, 'component', 'bar').data.x).toBe(1)
  })

  test('normalize directives', () => {
    const fooDirective = function () {}
    const options = {
      directives: {
        foo: fooDirective
      }
    }

    utils.normalizeDirectives(options)

    expect(options.directives.foo.bind).toBe(fooDirective)
  })
})
