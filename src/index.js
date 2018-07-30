import Formotor from './instance'
import { registryGlobalAPI } from './global'
import { registryProto } from './proto'

registryProto()
registryGlobalAPI(Formotor)

Formotor.version = '__VERSION__'

export default Formotor
