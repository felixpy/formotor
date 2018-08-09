import JZ from 'jquery'
import { setConfig, getConfig } from './config'
import { extend, initAssetRegisters } from './api'

function registryGlobalAPI (Formotor) {
  Formotor.JZ = JZ

  Formotor.extend = extend
  Formotor.setConfig = setConfig
  Formotor.getConfig = getConfig

  initAssetRegisters(Formotor)
}

export {
  registryGlobalAPI
}
