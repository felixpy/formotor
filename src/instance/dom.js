import JZ from 'jquery'
import { config } from '../global/config'
import { isArray, warn } from '../util'

function getEventHookClass (el) {
  if (!el.className) {
    return
  }
  let hookClass = ''
  let classList = el.className.split(' ')
  classList.forEach(function (cl) {
    if (config.eventHookRE.test(cl)) {
      hookClass += ('.' + cl)
    }
  })
  return hookClass
}

function applyEvent (component, node, eventName, method) {
  const hookClass = getEventHookClass(node.el)
  const hookEvent = eventName.split(config._eventSeparator).join(' ')
  if (!isArray(method)) {
    method = [method]
  }

  method.forEach(function (currentMethod) {
    if (!hookClass) {
      JZ(node.el).on(hookEvent, currentMethod)
    } else {
      proxyEvent(component, eventName, hookClass, currentMethod)
    }
  })
}

function proxyEvent (component, eventName, hookClass, method) {
  const proxyEvents = component._proxyEvents || (component._proxyEvents = [])
  const hookEvent = eventName.split(config._eventSeparator).join(' ')
  let bound = false

  proxyEvents.forEach(function (p) {
    if (p.e === eventName && p.hook === hookClass && p.fn.toString() === method.toString()) {
      warn('proxy event repeated, name: ' + eventName + ', hookClass: ' + hookClass)
      bound = true
    }
  })

  if (!bound) {
    component.$el.on(hookEvent, hookClass, method)
    proxyEvents.push({
      e: eventName,
      hook: hookClass,
      fn: method
    })
  }
}

function mergeDOMAPIs (Formotor) {
  Formotor.prototype._initProxies = function () {
    const comp = this
    const proxies = comp.$options.proxies

    if (proxies) {
      let eventName, selector, method
      for (let proxy in proxies) {
        method = proxies[proxy]
        proxy = proxy.split(' ')
        eventName = proxy[0]
        selector = proxy.slice(1).join(' ')

        if (method && comp[method] && comp[method]._isMethod) {
          if (eventName && selector) {
            proxyEvent(comp, eventName, selector, comp[method])
          }
        }
      }
    }

    return comp
  }

  Formotor.prototype.$find = function (selector) {
    return this.$el.find(selector)
  }
}

export {
  applyEvent,

  mergeDOMAPIs
}
