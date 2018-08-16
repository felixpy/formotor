import { isString, isPrivateAttr, isObject } from '../util/toolbox'

const config = {
  // public config
  silent: false,
  eventHookRE: /^j-/,
  disabledClasses: 'fm-component-disabled hidden',
  baseComponent: 'basic',

  // private config
  _eventSeparator: '|',
  _assetsType: ['component', 'directive'],
  _lifecycleHooks: ['init', 'ready']
}

function configure (opt, value = null) {
  if (isString(opt) && isPrivateAttr(opt)) {
    return
  }

  if (isObject(opt)) {
    Object.keys(opt).forEach(key => {
      configure(key, opt[key])
    })
  } else if (isString(opt)) {
    if (value) {
      config[opt] = value
    } else {
      return config[opt]
    }
  }
}

export {
  config,

  configure
}
