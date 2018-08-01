import JZ from 'jquery'
import { toArray, isFunction, isArray, includes } from '../util'
import { globalConfig } from './config'

const regs = {
  tag: /^(?:input|select|textarea|keygen)/i,
  check: /^(?:checkbox|radio)$/i,
  select: /^(?:select)$/i,
  invalidTags: /^(?:submit|button|image|reset|file)$/i
}

function isActiveElements (elem, config = {}) {
  const {
    postName,
    ignore,
    accessible,
    disableMode
  } = config
  const JZElem = JZ(elem)
  const isValidTags = !regs.invalidTags.test(elem.type)
  const hasName = this.name || JZElem.attr(postName)
  const isChecked = elem.checked || !regs.check.test(this.type)
  const ignoreFactor = !JZElem.is(ignore)
  const disableFactor = disableMode ? JZElem.is(`:disabled:not(${accessible})`) : true

  return isValidTags && hasName && isChecked && disableFactor && ignoreFactor
}

function getElementValue (elem, config = {}) {
  const {
    postName,
    middlewares
  } = config
  const JZElem = JZ(elem)
  const isMultiple = JZElem.is(':checkbox') || JZElem.is('select[multiple]')
  let rawName = JZElem.attr(postName) || elem.name
  let rawValue = JZElem.val()

  JZ.each(middlewares, function (group, groupConfig) {
    JZ.each(groupConfig, function (selector, fn) {
      if (JZElem.is(selector) && isFunction(fn)) {
        rawValue = isArray(rawValue) ? rawValue.map(v => fn.call(elem, v)) : fn.call(elem, rawValue)
      }
    })
  })

  if (rawValue == null) {
    return null
  }

  return isArray(rawValue) ? JZ.map(rawValue, valueItem => {
    return {
      name: rawName,
      value: valueItem,
      multi: isMultiple
    }
  }) : {
    name: rawName,
    value: rawValue,
    multi: isMultiple
  }
}

function serializeToArray (JZForm, options = {}, config = {}) {
  return JZForm
    .map(function () {
      return this.elements ? toArray(this.elements) : this
    })
    .filter(function () {
      return isActiveElements(this, config)
    })
    .map(function () {
      return getElementValue(this, config)
    })
    .get()
}

function convertArrayToObject (valuesArray = []) {
  const result = {}
  const multipleNames = []

  JZ.each(valuesArray, function () {
    const { name, value, multi } = this
    if (result[name]) {
      if (isArray(result[name]) && includes(multipleNames, name)) {
        result[name].push(value)
      } else {
        const currentValue = result[name]
        result[name] = [currentValue]
        result[name].push(value)
        multipleNames.push(name)
      }
    } else {
      result[name] = multi ? [value] : value
      if (multi) {
        multipleNames.push(name)
      }
    }
  })

  return result
}

function getCustomValues (JZForm, options = {}, config = {}, referValues = {}) {
  const {
    postName
  } = config
  const result = {}

  JZ.each(options, function (name, opt) {
    if (isFunction(opt)) {
      const selector = `[name="${name}"],[${postName}="${name}"]`
      const JZElements = JZForm.find(selector).add(JZForm.filter(selector))
      const customValue = opt.apply(JZElements, [JZForm, referValues])

      if (customValue != null) {
        result[name] = customValue
      }
    }
  })

  return result
}

function getValue (JZElem) {
  let result
  let convertToArray = false
  const get = (value, multi) => {
    if (value != null) {
      if (result != null) {
        result = multi ? [value] : value
        if (multi) {
          convertToArray = true
        }
      } else {
        if (!convertToArray) {
          result = [result]
          convertToArray = true
        }
        result.push(value)
      }
    }
  }

  JZElem.each(function () {
    const JZItem = JZ(this)
    const checkable = regs.check.test(this.type)

    if (checkable) {
      const multi = JZItem.is(':checkbox')
      if (this.checked) {
        get(this.value, multi)
      } else {
        get(JZItem.val(), false)
      }
    }
  })

  return result
}

function getValues (JZForm, options = {}, config = {}) {
  const mergedConfig = JZ.extend(true, {}, globalConfig, config)
  const JZRealForm = JZForm.is('form,:input') ? JZForm : JZForm.find(':input')
  const valueArray = serializeToArray(JZRealForm, options, mergedConfig)
  const valuesObject = convertArrayToObject(valueArray)
  const valuesObjectCopy = JZ.extend(true, {}, valuesObject)
  const customValuesObject = getCustomValues(JZRealForm, options, mergedConfig, valuesObjectCopy)

  return JZ.extend(valuesObject, customValuesObject)
}

function renderValueToForm (JZForm, values = {}, options = {}, config = {}) {
  const {
    postName
  } = config
  JZ.each(values, function (name, value) {
    const opt = options[name]
    const selector = `[name="${name}"],[${postName}="${name}"]`
    const JZElements = JZForm.find(selector).add(JZForm.filter(selector))

    if (isFunction(opt)) {
      opt.apply(JZElements, [JZForm, value])
    } else {
      setValue(JZElements, value)
    }
  })
}

function setValue (JZElem, value) {
  JZElem.each(function () {
    const JZItem = JZ(this)
    const checkable = regs.check.test(this.type)
    if (checkable) {
      value = isArray(value) ? value : [value]
      value = value.map(v => v.toString ? v.toString() : v)
      this.checked = includes(value, this.value)
    } else {
      JZItem.val(value)
    }
  })
}

function setValues (JZForm, values = {}, options = {}, config = {}) {
  const mergedConfig = JZ.extend(true, {}, globalConfig, config)

  renderValueToForm(JZForm, values, options, mergedConfig)
}

export {
  getValue,
  setValue,

  getValues,
  setValues
}
