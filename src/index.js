import Formotor from './instance'
import { registryGlobalAPI } from './global'
import { registryProto } from './proto'

registryProto(Formotor)
registryGlobalAPI(Formotor)

Formotor.version = '__VERSION__'

export default Formotor
