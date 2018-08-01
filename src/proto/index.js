import JZ from 'jquery'
import { toArray, isFunction, isString } from '../util'
import { getConfig, setConfig } from './config'
import * as valueProtoAPI from './value'

const PROTO_APIS = {
  ...valueProtoAPI
}

function registryProto (Formotor) {
  // configuration
  Formotor.getConfig = getConfig
  Formotor.setConfig = setConfig

  // proto api
  JZ.fn.formotor = function (key) {
    if (isString(key)) {
      const mt = function () {
        let args = toArray(arguments)
        args = [this].concat(args)
        if (PROTO_APIS[key]) {
          return PROTO_APIS[key].apply(this, args)
        }
      }
      if (isFunction(mt)) {
        const args = toArray(arguments).slice(1)
        return mt.apply(this, args)
      } else {
        return mt
      }
    }
  }
}

export {
  registryProto
}
