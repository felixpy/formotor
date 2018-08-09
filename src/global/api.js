import JZ from 'jquery'
import { config } from '../global/config'
import { isUndef } from '../util'

function extend (source, dest, deep) {
  if (isUndef(deep)) {
    deep = true
  } else {
    deep = !!deep
  }
  return JZ.extend(deep, {}, source, dest)
}

function initAssetRegisters (Formotor) {
  Formotor.options = {}
  config._assetsType.forEach(function (type) {
    Formotor.options[type + 's'] = {}
  })

  config._assetsType.forEach(function (type) {
    Formotor[type] = function (id, def) {
      if (!def) {
        return this.options[type + 's'][id]
      } else {
        this.options[type + 's'][id] = def
        return def
      }
    }
  })

  Formotor.component('basic', {})
}

export {
  extend,

  initAssetRegisters
}
