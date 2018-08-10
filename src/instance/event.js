import { isArray, toArray } from '../util'

function mergeEvents (Formotor) {
  Formotor.prototype._initEvents = function () {
    const comp = this
    const events = comp.$options.events
    comp._events = {}

    if (events) {
      let callbacks
      for (let evt in events) {
        callbacks = events[evt]

        if (!isArray(callbacks) && callbacks) {
          callbacks = [callbacks]
        }

        if (callbacks && callbacks.length) {
          callbacks.forEach(function (cb) {
            if (comp[cb] && comp[cb]._isMethod) {
              comp.$on(evt, comp[cb])
            }
          })
        }
      }
    }

    return comp
  }

  Formotor.prototype.$on = function (event, fn) {
    const comp = this;
    (comp._events[event] || (comp._events[event] = [])).push(fn)
    return comp
  }

  Formotor.prototype.$off = function (event, fn) {
    const comp = this
    // all
    if (!arguments.length) {
      comp._events = {}
      return comp
    }
    // specific event
    const callbacks = comp._events[event]
    if (!callbacks) {
      return comp
    }
    if (arguments.length === 1) {
      comp._events[event] = null
      return comp
    }
    // specific handler
    let cb
    let i = callbacks.length
    while (i--) {
      cb = callbacks[i]
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1)
        break
      }
    }
    return comp
  }

  Formotor.prototype.$once = function (event, fn) {
    const comp = this

    function proxy () {
      comp.$off(event, proxy)
      fn.apply(comp, arguments)
    }
    proxy.fn = fn
    comp.$on(event, proxy)
    return comp
  }

  Formotor.prototype.$trigger = function (event) {
    const comp = this
    let callbacks = comp._events[event]
    if (callbacks) {
      callbacks = callbacks.length > 1 ? toArray(callbacks) : callbacks
      const args = Array.prototype.slice.call(arguments, 1)
      for (let i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].apply(comp, args)
      }
    }
    return comp
  }

  Formotor.prototype.$listen = function () {
    const comp = this
    const args = Array.prototype.slice.call(arguments)
    comp.$root.$on.apply(comp.$root, args)
    return comp
  }

  Formotor.prototype.$broadcast = function () {
    const comp = this
    const args = Array.prototype.slice.call(arguments)
    comp.$root.$trigger.apply(comp.$root, args)
    return comp
  }
}

export {
  mergeEvents
}
