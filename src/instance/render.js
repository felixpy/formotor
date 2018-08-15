import JZ from 'jquery'
import { config } from '../global/config'
import { scanElement } from '../compiler'
import { resolveAsset } from '../util'
import { applyEvent } from './dom'

function applyDirective (component, node, directive, hook) {
  const def = resolveAsset(component.$options, 'directive', directive.name)
  const fn = def ? def[hook] : null
  if (fn) {
    fn(node.el, directive, component)
  }
}

function createSubComponent (Formotor, comp, sub) {
  let asset = resolveAsset(comp.$options, 'component', sub.name)
  let options

  if (!asset) {
    asset = resolveAsset(comp.$options, 'component', config.baseComponent)
  }
  options = JZ.extend(true, {
    el: sub.el,
    _component: sub.name,
    _parent: comp,
    _isSubComponent: true
  }, asset)

  return new Formotor(options)
}

function mergeRender (Formotor) {
  Formotor.prototype._scan = function () {
    const comp = this
    comp._binding = scanElement(comp.$el)
    return comp
  }

  Formotor.prototype._render = function () {
    const comp = this
    const nodes = comp._binding.nodes

    nodes.forEach(function (node) {
      node.render.call(comp, node)
    })

    return comp
  }

  Formotor.prototype._excuteNode = function (node, data) {
    const comp = this

    if (data.directives && data.directives.length) {
      data.directives.forEach(function (dir) {
        applyDirective(comp, node, dir, 'bind')
      })
    }

    if (data.on) {
      for (const key in data.on) {
        applyEvent(comp, node, key, data.on[key])
      }
    }

    return comp
  }

  Formotor.prototype._createSubComponent = function () {
    const comp = this
    const subComponents = comp._binding.subComponents
    const children = comp.$children || (comp.$children = [])

    subComponents.forEach(function (sub) {
      const subComp = createSubComponent(Formotor, comp, sub)
      if (subComp) {
        children.push(subComp)
      }
    })

    return comp
  }

  Formotor.prototype._registerRefs = function () {
    const comp = this
    const refs = comp.$root._refs || (comp.$root._refs = {})

    if (comp.$name) {
      (refs[comp.$name] || (refs[comp.$name] = [])).push(comp)
    }

    return comp
  }
}

export {
  mergeRender
}
