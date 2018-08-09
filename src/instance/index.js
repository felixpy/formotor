import { mergeInit } from './init'
import { mergeLifecycle } from './lifecycle'
import { mergeDOMAPIs } from './dom'
import { mergeForm } from './form'
import { mergeEvents } from './event'
import { mergeRender } from './render'

function Formotor (options = {}) {
  this._init(options)
}

mergeInit(Formotor)
mergeLifecycle(Formotor)
mergeEvents(Formotor)
mergeRender(Formotor)
mergeDOMAPIs(Formotor)
mergeForm(Formotor)

export default Formotor
