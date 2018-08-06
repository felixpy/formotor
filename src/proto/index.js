import JZ from 'jquery'
import { toArray, isString } from '../util'
import { getConfig, setConfig } from './config'
import * as valueProtoAPI from './value'

const PROTO_APIS = {
  ...valueProtoAPI
}

function registryProto (Formotor) {
  // configuration
  Formotor.getProtoConfig = getConfig
  Formotor.setProtoConfig = setConfig

  // proto api
  JZ.fn.formotor = function (key) {
    if (isString(key)) {
      const fn = function () {
        const api = PROTO_APIS[key]
        const args = [this].concat(toArray(arguments))
        if (api) {
          return api.apply(this, args)
        }
        return this
      }
      return fn.apply(this, toArray(arguments).slice(1))
    }
    return this
  }
}

export {
  registryProto
}
