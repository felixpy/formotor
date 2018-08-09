import JZ from 'jquery'
import { isFunction, isPrivateAttr, mergeOptions } from '../util'
import { callHook } from './lifecycle'

let cid = 0

function mergeInit (Formotor) {
  Formotor.prototype._init = function (options = {}) {
    const comp = this
    comp._cid = cid++
    comp._isFormitComponent = true
    comp._disabled = false

    if (options && options._isSubComponent) {
      comp.$options = mergeOptions(options._parent.$options, options || {})
    } else {
      comp.$options = mergeOptions(comp.constructor.options, options || {})
    }

    comp.$el = JZ(comp.$options.el)
    comp.$parent = comp.$options._parent || null
    comp.$root = comp.$parent ? comp.$parent.$root : comp

    if (comp.$options._component) {
      comp.$name = comp.$options._component
      comp.$primary = comp.$el.find('[name="' + comp.$name + '"]')
    }

    comp._initData()
    comp._initHooks()
    comp._initMethods()
    comp._initEvents()

    callHook(comp, 'init')

    comp._scan()
    comp._render()
    comp._initProxies()
    comp._registerRefs()
    comp._createSubComponent()

    callHook(comp, 'ready')

    return comp
  }

  Formotor.prototype._initData = function () {
    const comp = this
    let data = comp.$options.data

    if (data) {
      data = isFunction(data) ? data() : data
      for (const key in data) {
        if (!isPrivateAttr(key)) {
          if (isFunction(data[key])) {
            comp[key] = data[key]()
          } else {
            comp[key] = data[key]
          }
        }
      }
    }

    if (!comp.model) {
      comp.model = comp.$parent ? comp.$parent.model : {}
    }

    return comp
  }

  Formotor.prototype._initMethods = function () {
    const comp = this
    const methods = comp.$options.methods

    if (methods) {
      for (const key in methods) {
        if (!isPrivateAttr(key)) {
          comp[key] = JZ.proxy(methods[key], comp)
          comp[key]._isMethod = true
        }
      }
    }

    return comp
  }
}

export {
  mergeInit
}
