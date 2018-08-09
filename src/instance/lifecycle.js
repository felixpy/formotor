import { config } from '../global/config'
import { isArray } from '../util'

function callHook (comp, hook) {
  const handlers = comp.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(comp)
    }
  }
  comp.$trigger('hook:' + hook)
}

function mergeLifecycle (Formotor) {
  Formotor.prototype._initHooks = function () {
    const comp = this

    config._lifecycleHooks.forEach(function (hook) {
      const hooks = comp.$options[hook] || []
      comp.$options[hook] = isArray(hooks) ? hooks : [hooks]
    })

    return comp
  }
}

export {
  callHook,
  mergeLifecycle
}
