import { config } from '../global/config'
import { isFunction } from './toolbox'

function normalizeDirectives (options) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (isFunction(def)) {
        dirs[key] = {
          bind: def
        }
      }
    }
  }
}

function resolveAsset (options, type, name) {
  const assets = options[type + 's']
  if (assets) {
    return assets[name]
  }
}

function mergeOptions (parent, child) {
  config._assetsType.forEach(function (type) {
    const childAssets = child[type + 's'] || (child[type + 's'] = {})
    const parentAssets = parent[type + 's']

    if (parentAssets) {
      for (const key in parentAssets) {
        childAssets[key] = childAssets[key] || parentAssets[key]
      }
    }
  })
  normalizeDirectives(child)
  return child
}

export {
  normalizeDirectives,
  resolveAsset,
  mergeOptions
}
