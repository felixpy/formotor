import JZ from 'jquery'
import { configure } from './config'
import { extend, initAssetRegisters } from './api'

function registryGlobalAPI (Formotor) {
  Formotor.JZ = JZ

  Formotor.extend = extend
  Formotor.config = configure

  initAssetRegisters(Formotor)
}

export {
  registryGlobalAPI
}
