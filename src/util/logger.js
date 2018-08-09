import { config } from '../global/config'

function warn (msg) {
  if (!config.silent) {
    console.error('[Formotor Warn]: ' + msg)
  }
}

export {
  warn
}
