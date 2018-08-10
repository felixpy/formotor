import JZ from 'jquery'
import { isString } from '../util/toolbox'

const publicConfig = {
  silent: false,
  eventHookRE: /^j-/,
  disabledClasses: 'fm-component-disabled hidden',
  baseComponent: 'basic'
}

const privateConfig = {
  _eventSeparator: '|',
  _assetsType: ['component', 'directive'],
  _lifecycleHooks: ['init', 'ready']
}

const formotorConfig = JZ.extend(privateConfig, publicConfig)

function getConfig (key) {
  if (isString(key)) {
    return publicConfig[key]
  }
  return JZ.extend(true, {}, publicConfig)
}

function setConfig (firstArg = {}, secondArg = null) {
  if (isString(firstArg)) {
    publicConfig[firstArg] = secondArg
  }
  JZ.extend(true, publicConfig, firstArg)
}

export {
  setConfig,
  getConfig,

  formotorConfig as config
}
