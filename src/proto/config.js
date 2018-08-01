import JZ from 'jquery'
import { isString } from '../util'

const globalConfig = {
  // custom element name
  postNameAttr: 'data-post-name',

  // ignore appointed elements
  ignoreSelector: '.fm-ignore',

  // alow formotor to access disabled elements
  accessibleSelector: '.fm-accessible',

  // middlewares that apply to each value
  middlewares: {
    trim: {
      'textarea,[type=text]': function (value = '') {
        return value.trim()
      }
    }
  }
}

function getConfig (key) {
  if (isString(key)) {
    return globalConfig[key]
  }
  return JZ.extend(true, {}, globalConfig)
}

function setConfig (firstArg = {}, secondArg = null) {
  if (isString(firstArg)) {
    globalConfig[firstArg] = secondArg
  }
  JZ.extend(true, globalConfig, firstArg)
}

export {
  setConfig,
  getConfig,

  globalConfig
}
