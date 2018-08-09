import JZ from 'jquery'
import { isArray } from '../util'
import { generate } from './generate'

const dirRE = /^fi-|^@/
const onRE = /^@|^fi-on:/
const argRE = /:(.*)$/
const modifierRE = /\.[^.]+/g

function getDOMElement (el) {
  return JZ(el).get(0)
}

function scanElement (el) {
  const rootNode = {
    el: getDOMElement(el),
    nodes: [],
    subComponents: []
  }
  const parseElement = function (el, isRoot = false) {
    const node = {
      el: getDOMElement(el),
      attrsMap: {}
    }

    const parseChildren = function (el) {
      JZ(el).children().each(function (i, child) {
        parseElement(child)
      })
    }

    if (isRoot) {
      parseChildren(node.el)
    } else {
      processAttrs(node)

      // is component
      if (node.component) {
        if (node.dirCount > 1) {
          rootNode.nodes.push(node)
        }
        rootNode.subComponents.push({
          el: node.el,
          name: node.component
        })
      } else {
        if (node.dirCount) {
          rootNode.nodes.push(node)
        }
        parseChildren(node.el)
      }
    }

    return node
  }

  parseElement(rootNode.el, true)
  generate(rootNode.nodes)
  return rootNode
}

function processAttrs (node) {
  node.dirCount = 0
  JZ.each(node.el.attributes, function (index, attr) {
    let name = attr.name
    let value = attr.value
    let modifiers, arg, argMatch

    if (dirRE.test(name)) {
      node.attrsMap[name] = value
      node.dirCount++
      modifiers = parseModifiers(name)
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (onRE.test(name)) {
        name = name.replace(onRE, '')
        addHandler(node, name, value, modifiers)
      } else {
        name = name.replace(dirRE, '')
        argMatch = name.match(argRE)
        if (argMatch && (arg = argMatch[1])) {
          name = name.slice(0, -(arg.length + 1))
        }

        if (name === 'component') {
          node.component = value
        } else {
          addDirective(node, name, value, arg, modifiers)
        }
      }
    }
  })
}

function parseModifiers (name) {
  const match = name.match(modifierRE)
  const ret = {}
  if (match) {
    match.forEach(function (m) {
      ret[m.slice(1)] = true
    })
    return ret
  }
}

function addHandler (node, name, value, modifiers) {
  const events = node.events || (node.events = {})
  const handler = {
    value: value,
    modifiers: modifiers
  }
  const currentHandler = events[name]

  if (isArray(currentHandler)) {
    currentHandler.push(handler)
  } else if (currentHandler) {
    events[name] = [currentHandler, handler]
  } else {
    events[name] = handler
  }
}

function addDirective (node, name, value, arg, modifiers) {
  node.directives = node.directives || []
  node.directives.push({
    name: name,
    value: value,
    arg: arg,
    modifiers: modifiers
  })
}

export {
  scanElement
}
