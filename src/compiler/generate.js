import { isArray } from '../util'

function noop () {}

function generate (nodes) {
  nodes.forEach(function (node) {
    let code = 'with(this){_excuteNode(node, {'

    if (node.directives) {
      code += genDirectives(node) + ','
    }

    if (node.events) {
      code += genHandlers(node) + ','
    }

    code = code.replace(/,$/, '') + '});}'
    node.code = code

    try {
      /* eslint-disable-next-line */
      node.render = new Function('node', node.code)
    } catch (ex) {
      node.render = noop
    }
  })
}

function genDirectives (node) {
  let ret = 'directives:['
  node.directives.forEach(function (dir) {
    ret += '{name:"' + dir.name + '"' +
      (dir.value ? ',value:(' + dir.value + '),expression:' + JSON.stringify(dir.value) : '') +
      (dir.arg ? ',arg:"' + dir.arg + '"' : '') +
      (dir.modifiers ? ',modifiers:' + JSON.stringify(dir.modifiers) : '') + '},'
  })
  return ret.slice(0, -1) + ']'
}

function genHandlers (node) {
  let ret = 'on:{'
  for (let name in node.events) {
    ret += '"' + name + '":' + genHandler(node.events[name]) + ','
  }
  return ret.slice(0, -1) + '}'
}

function genHandler (handler) {
  const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
  const modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: 'if($event.target !== $event.currentTarget)return;'
  }

  if (!handler) {
    return 'function(){}'
  } else if (isArray(handler)) {
    return '[' + handler.map(genHandler).join(',') + ']'
  } else if (!handler.modifiers) {
    return simplePathRE.test(handler.value) ? handler.value : 'function($event){' + handler.value + '}'
  } else {
    let code = 'function($event){'
    for (let key in handler.modifiers) {
      code += modifierCode[key] || genKeyFilter(key)
    }
    let handlerCode = simplePathRE.test(handler.value) ? handler.value + '($event)' : handler.value
    return code + handlerCode + '}'
  }
}

function genKeyFilter (key) {
  const keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  }
  const code = parseInt(key, 10) || keyCodes[key]

  if (!code) {
    return ''
  }

  if (isArray(code)) {
    return 'if(' + code.map(function (c) {
      return '$event.keyCode!==' + c
    }).join('&&') + ')return;'
  } else {
    return 'if($event.keyCode!==' + code + ')return;'
  }
}

export {
  generate
}
