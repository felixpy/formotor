import JZ from 'jquery'
import { isString } from '../util'

const globalConfig = {
  // custom element name
  postName: 'data-post-name',

  // ignore appointed elements
  ignore: '.fm-ignore',

  // alow formotor to access appointed disabled elements
  accessible: '.fm-accessible',

  // alow formotor to access all disabled elements
  disableMode: false,

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
