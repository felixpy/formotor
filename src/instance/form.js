import JZ from 'jquery'
import { config } from '../global/config'
import { isFunction, isUndef } from '../util'

function setValues (el, data, handlers) {
  const JZComponent = JZ(el)
  let JZFormElement = JZComponent.find(':input')
  let nameMap = {}
  let currentName

  if (!data) {
    return
  }
  handlers = handlers || {}

  while (JZFormElement.length) {
    currentName = JZFormElement.get(0).name
    if (currentName) {
      nameMap[currentName] = JZFormElement.filter('[name="' + currentName + '"]')
      JZFormElement = JZFormElement.not('[name="' + currentName + '"]')
    } else {
      JZFormElement = JZFormElement.slice(1)
    }
  }

  JZ.each(handlers, function (name) {
    if (!nameMap[name]) {
      nameMap[name] = JZ()
    }
  })

  JZ.each(nameMap, function (name) {
    let value = data[name]
    if (isFunction(handlers[name])) {
      handlers[name].apply(this, [JZComponent, value, data])
    } else {
      if (value != null) {
        JZ(this).formit('setValue', value)
      }
    }
  })
}

function getValues (el, options, config) {
  const JZComponent = JZ(el)

  options = JZ.extend({}, options)
  config = JZ.extend({
    trimText: true
  }, config)

  return JZComponent.formit('getValues', options, config)
}

function mergeForm (Formotor) {
  Formotor.prototype.$set = function (data) {
    const comp = this
    const model = data || comp.model

    if (comp._disabled) {
      if (isFunction(comp.setDisabledValues)) {
        comp.setDisabledValues()
      }
      return
    }

    if (model) {
      if (!isFunction(comp.setValues)) {
        if (!comp.$children.length) {
          comp.$setValues(model)
        } else {
          comp.$children.forEach(function (child) {
            if (data) {
              child.$set(data)
            } else {
              child.$set()
            }
          })
        }
      } else {
        comp.setValues(model)
      }
    }
  }

  Formotor.prototype.$get = function () {
    const comp = this
    let model

    if (comp._disabled) {
      return isFunction(comp.getDisabledValues) ? comp.getDisabledValues() : {}
    }

    if (!isFunction(comp.getValues)) {
      if (!comp.$children.length) {
        model = comp.$getValues()
      } else {
        comp.$children.forEach(function (child) {
          model = JZ.extend(model, child.$get())
        })
      }
    } else {
      model = comp.getValues()
    }

    return model
  }

  Formotor.prototype.$setValues = function (data, handlers) {
    const comp = this

    setValues(comp.$el, data, handlers)

    return comp
  }

  Formotor.prototype.$getValues = function (options, config) {
    const comp = this

    return getValues(comp.$el, options, config)
  }

  Formotor.prototype.$provideRef = function () {
    const comp = this
    let data

    if (!isFunction(comp.provideRef)) {
      data = comp.$get()
    } else {
      data = comp.provideRef()
    }

    return data
  }

  Formotor.prototype.$callRef = function (name, entire) {
    const comp = this
    const refs = comp.$root._refs[name]
    let data = {}

    if (!name || !refs) {
      return
    }

    refs.forEach(function (ref) {
      data = JZ.extend(data, ref.$provideRef())
    })

    if (!entire) {
      data = data[name]
    }

    return data
  }

  Formotor.prototype.$disable = function (status) {
    const comp = this

    if (isUndef(status)) {
      return comp._disabled
    }

    comp._disabled = !!status
    if (comp._disabled) {
      comp.$el.addClass(config.disabledClasses)
    } else {
      comp.$el.removeClass(config.disabledClasses)
    }

    return comp
  }

  Formotor.prototype.$disableFormElements = function (status, filters) {
    const comp = this

    if (isUndef(status)) {
      status = true
    } else {
      status = !!status
    }
    filters = filters || '*'

    if (!isFunction(comp.disableFormElements)) {
      comp.$find(':input').filter(filters).prop('disabled', status)
    } else {
      comp.disableFormElements(status, filters)
    }

    return comp
  }
}

export {
  mergeForm
}
