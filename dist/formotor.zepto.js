/**
 * Formotor.js v0.1.0
 * (c) 2018 Felix Yang
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('zepto')) :
  typeof define === 'function' && define.amd ? define(['zepto'], factory) :
  (global.Formotor = factory(global.Zepto));
}(this, (function (JZ) { 'use strict';

  JZ = JZ && JZ.hasOwnProperty('default') ? JZ['default'] : JZ;

  function Formotor() {
  }

  function registryGlobalAPI(Formotor) {
    Formotor.JZ = JZ;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function includes(target, value) {
    return Array.prototype.indexOf.call(target, value) !== -1;
  }

  function isUndef(value) {
    return typeof value === 'undefined';
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function isArray(value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
  }

  function toArray$1(target) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return Array.prototype.slice.call(target, index);
  }

  var globalConfig = {
    // custom element name
    postName: 'data-post-name',

    // ignore appointed elements
    ignore: '.fm-ignore',

    // alow formotor to access appointed disabled elements
    accessible: '.fm-accessible',

    // alow formotor to access all disabled elements
    disableMode: false,

    // middlewares that apply to each value
    middlewares: {
      trim: {
        'textarea,[type=text]': function textareaTypeText() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

          return value.trim();
        }
      }
    }
  };

  function getConfig(key) {
    if (isString(key)) {
      return globalConfig[key];
    }
    return JZ.extend(true, {}, globalConfig);
  }

  function setConfig() {
    var firstArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var secondArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (isString(firstArg)) {
      globalConfig[firstArg] = secondArg;
    }
    JZ.extend(true, globalConfig, firstArg);
  }

  var regs = {
    tag: /^(?:input|select|textarea|keygen)/i,
    check: /^(?:checkbox|radio)$/i,
    select: /^(?:select)$/i,
    invalidTags: /^(?:submit|button|image|reset|file)$/i
  };

  function isActiveElements(elem) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var postName = config.postName,
        ignore = config.ignore,
        accessible = config.accessible,
        disableMode = config.disableMode;

    var JZElem = JZ(elem);
    var isValidTags = !regs.invalidTags.test(elem.type);
    var hasName = elem.name || JZElem.attr(postName);
    var isChecked = elem.checked || !regs.check.test(elem.type);
    var ignoreFactor = !JZElem.is(ignore);
    var disableFactor = !disableMode ? !JZElem.is(':disabled:not(' + accessible + ')') : true;

    return isValidTags && hasName && isChecked && disableFactor && ignoreFactor;
  }

  function getElementValue(elem) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var postName = config.postName,
        middlewares = config.middlewares;

    var JZElem = JZ(elem);
    var isMultiple = JZElem.is(':checkbox') || JZElem.is('select[multiple]');
    var rawName = JZElem.attr(postName) || elem.name;
    var rawValue = JZElem.val();

    JZ.each(middlewares, function (group, groupConfig) {
      JZ.each(groupConfig, function (selector, fn) {
        if (JZElem.is(selector) && isFunction(fn)) {
          rawValue = isArray(rawValue) ? rawValue.map(function (v) {
            return fn.call(elem, v);
          }) : fn.call(elem, rawValue);
        }
      });
    });

    if (rawValue == null) {
      return null;
    }

    return isArray(rawValue) ? JZ.map(rawValue, function (valueItem) {
      return {
        name: rawName,
        value: valueItem,
        multi: isMultiple
      };
    }) : {
      name: rawName,
      value: rawValue,
      multi: isMultiple
    };
  }

  function serializeToArray(JZForm) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return JZForm.map(function () {
      return this.elements ? toArray$1(this.elements) : this;
    }).filter(function () {
      return isActiveElements(this, config);
    }).map(function () {
      return getElementValue(this, config);
    }).get();
  }

  function convertArrayToObject() {
    var valuesArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var result = {};
    var multipleNames = [];

    JZ.each(valuesArray, function () {
      var name = this.name,
          value = this.value,
          multi = this.multi;

      if (result[name]) {
        if (isArray(result[name]) && includes(multipleNames, name)) {
          result[name].push(value);
        } else {
          var currentValue = result[name];
          result[name] = [currentValue];
          result[name].push(value);
          multipleNames.push(name);
        }
      } else {
        result[name] = multi ? [value] : value;
        if (multi) {
          multipleNames.push(name);
        }
      }
    });

    return result;
  }

  function getCustomValues(JZForm) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var referValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var postName = config.postName;

    var result = {};

    JZ.each(options, function (name, opt) {
      if (isFunction(opt)) {
        var selector = '[name="' + name + '"],[' + postName + '="' + name + '"]';
        var JZElements = JZForm.find(selector).add(JZForm.filter(selector));
        var customValue = opt.apply(JZElements, [JZForm, referValues]);

        if (customValue != null) {
          result[name] = customValue;
        }
      }
    });

    return result;
  }

  function getValue(JZElem) {
    var result = void 0;
    var convertToArray = false;
    var get = function get(value, multi) {
      if (value != null) {
        if (isUndef(result)) {
          result = multi ? [value] : value;
          if (multi) {
            convertToArray = true;
          }
        } else {
          if (!convertToArray) {
            result = [result];
            convertToArray = true;
          }
          result.push(value);
        }
      }
    };

    JZElem.each(function () {
      var JZItem = JZ(this);
      var checkable = regs.check.test(this.type);

      if (checkable) {
        var multi = JZItem.is(':checkbox');
        if (this.checked) {
          get(this.value, multi);
        }
      } else {
        get(JZItem.val(), false);
      }
    });

    return result;
  }

  function getValues(JZForm) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var mergedConfig = JZ.extend(true, {}, globalConfig, config);
    var JZRealForm = JZForm.is('form') ? JZForm : JZForm.find(':input');
    var valueArray = serializeToArray(JZRealForm, mergedConfig);
    var valuesObject = convertArrayToObject(valueArray);
    var valuesObjectCopy = JZ.extend(true, {}, valuesObject);
    var customValuesObject = getCustomValues(JZForm, options, mergedConfig, valuesObjectCopy);

    return JZ.extend(valuesObject, customValuesObject);
  }

  function renderValueToForm(JZForm) {
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var postName = config.postName;

    JZ.each(values, function (name, value) {
      var opt = options[name];
      var selector = '[name="' + name + '"],[' + postName + '="' + name + '"]';
      var JZElements = JZForm.find(selector).add(JZForm.filter(selector));

      if (isFunction(opt)) {
        opt.apply(JZElements, [JZForm, value, values]);
      } else {
        setValue(JZElements, value);
      }
    });
  }

  function setValue(JZElem, value) {
    JZElem.each(function () {
      var JZItem = JZ(this);
      var checkable = regs.check.test(this.type);
      if (checkable) {
        value = isArray(value) ? value : [value];
        value = value.map(function (v) {
          return v.toString ? v.toString() : v;
        });
        this.checked = includes(value, this.value);
      } else {
        JZItem.val(value);
      }
    });
  }

  function setValues(JZForm) {
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var mergedConfig = JZ.extend(true, {}, globalConfig, config);

    renderValueToForm(JZForm, values, options, mergedConfig);
  }

  var valueProtoAPI = /*#__PURE__*/Object.freeze({
    getValue: getValue,
    setValue: setValue,
    getValues: getValues,
    setValues: setValues
  });

  var PROTO_APIS = _extends({}, valueProtoAPI);

  function registryProto(Formotor) {
    // configuration
    Formotor.getConfig = getConfig;
    Formotor.setConfig = setConfig;

    // proto api
    JZ.fn.formotor = function (key) {
      if (isString(key)) {
        var fn = function fn() {
          var api = PROTO_APIS[key];
          var args = [this].concat(toArray$1(arguments));
          if (api) {
            return api.apply(this, args);
          }
          return this;
        };
        return fn.apply(this, toArray$1(arguments).slice(1));
      }
      return this;
    };
  }

  registryProto(Formotor);
  registryGlobalAPI(Formotor);

  Formotor.version = '0.1.0';

  return Formotor;

})));
