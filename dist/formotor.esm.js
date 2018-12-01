/**
 * Formotor.js v1.0.1
 * (c) 2018 Felix Yang
 */
import JZ from 'jquery';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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

function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
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

function hasKey(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function toArray$1(target) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return Array.prototype.slice.call(target, index);
}

function isPrivateAttr(key) {
  return (/^[_$]/.test(key)
  );
}

var config = {
  // public config
  silent: false,
  eventHookRE: /^j-/,
  disabledClasses: 'fm-component-disabled hidden',
  baseComponent: 'basic',

  // private config
  _eventSeparator: '|',
  _assetsType: ['component', 'directive'],
  _lifecycleHooks: ['init', 'ready']
};

function configure(opt) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (isString(opt) && isPrivateAttr(opt)) {
    return;
  }

  if (isObject(opt)) {
    Object.keys(opt).forEach(function (key) {
      configure(key, opt[key]);
    });
  } else if (isString(opt)) {
    if (value) {
      config[opt] = value;
    } else {
      return config[opt];
    }
  }
}

function warn() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (!config.silent) {
    console.error('[Formotor Warn]: ' + msg);
  }
}

function normalizeDirectives(options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (isFunction(def)) {
        dirs[key] = {
          bind: def
        };
      }
    }
  }
}

function resolveAsset(options, type, name) {
  var assets = options[type + 's'];
  if (assets) {
    return assets[name];
  }
}

function mergeOptions(parent, child) {
  config._assetsType.forEach(function (type) {
    var childAssets = child[type + 's'] || (child[type + 's'] = {});
    var parentAssets = parent[type + 's'];

    if (parentAssets) {
      for (var key in parentAssets) {
        childAssets[key] = childAssets[key] || parentAssets[key];
      }
    }
  });
  normalizeDirectives(child);
  return child;
}

function callHook(comp, hook) {
  var handlers = comp.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(comp);
    }
  }
  comp.$trigger('hook:' + hook);
}

function mergeLifecycle(Formotor) {
  Formotor.prototype._initHooks = function () {
    var comp = this;

    config._lifecycleHooks.forEach(function (hook) {
      var hooks = comp.$options[hook] || [];
      comp.$options[hook] = isArray(hooks) ? hooks : [hooks];
    });

    return comp;
  };
}

var cid = 0;

function mergeInit(Formotor) {
  Formotor.prototype._init = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var comp = this;
    comp._cid = cid++;
    comp._isFormotorComponent = true;
    comp._disabled = false;

    if (options && options._isSubComponent) {
      comp.$options = mergeOptions(options._parent.$options, options || {});
    } else {
      comp.$options = mergeOptions(comp.constructor.options, options || {});
    }

    comp.$el = JZ(comp.$options.el);
    comp.$parent = comp.$options._parent || null;
    comp.$root = comp.$parent ? comp.$parent.$root : comp;

    if (comp.$options._component) {
      comp.$name = comp.$options._component;
      comp.$primary = comp.$el.find('[name="' + comp.$name + '"]');
    }

    comp._initData();
    comp._initHooks();
    comp._initMethods();
    comp._initEvents();

    callHook(comp, 'init');

    comp._scan();
    comp._render();
    comp._initProxies();
    comp._registerRefs();
    comp._createSubComponent();

    callHook(comp, 'ready');

    return comp;
  };

  Formotor.prototype._initData = function () {
    var comp = this;
    var data = comp.$options.data;

    if (data) {
      data = isFunction(data) ? data() : data;
      for (var key in data) {
        if (!isPrivateAttr(key)) {
          if (isFunction(data[key])) {
            comp[key] = data[key]();
          } else {
            comp[key] = data[key];
          }
        }
      }
    }

    if (!comp.model) {
      comp.model = comp.$parent ? comp.$parent.model : {};
    }

    return comp;
  };

  Formotor.prototype._initMethods = function () {
    var comp = this;
    var methods = comp.$options.methods;

    if (methods) {
      for (var key in methods) {
        if (!isPrivateAttr(key)) {
          comp[key] = JZ.proxy(methods[key], comp);
          comp[key]._isMethod = true;
        }
      }
    }

    return comp;
  };
}

function getEventHookClass(el) {
  if (!el.className) {
    return;
  }
  var hookClass = '';
  var classList = el.className.split(' ');
  classList.forEach(function (cl) {
    if (config.eventHookRE.test(cl)) {
      hookClass += '.' + cl;
    }
  });
  return hookClass;
}

function applyEvent(component, node, eventName, method) {
  var hookClass = getEventHookClass(node.el);
  var hookEvent = eventName.split(config._eventSeparator).join(' ');
  if (!isArray(method)) {
    method = [method];
  }

  method.forEach(function (currentMethod) {
    if (!hookClass) {
      JZ(node.el).on(hookEvent, currentMethod);
    } else {
      proxyEvent(component, eventName, hookClass, currentMethod);
    }
  });
}

function proxyEvent(component, eventName, hookClass, method) {
  var proxyEvents = component._proxyEvents || (component._proxyEvents = []);
  var hookEvent = eventName.split(config._eventSeparator).join(' ');
  var bound = false;

  proxyEvents.forEach(function (p) {
    if (p.e === eventName && p.hook === hookClass && p.fn.toString() === method.toString()) {
      warn('proxy event repeated, name: ' + eventName + ', hookClass: ' + hookClass);
      bound = true;
    }
  });

  if (!bound) {
    component.$el.on(hookEvent, hookClass, method);
    proxyEvents.push({
      e: eventName,
      hook: hookClass,
      fn: method
    });
  }
}

function mergeDOMAPIs(Formotor) {
  Formotor.prototype._initProxies = function () {
    var comp = this;
    var proxies = comp.$options.proxies;

    if (proxies) {
      var eventName = void 0,
          selector = void 0,
          method = void 0;
      for (var proxy in proxies) {
        method = proxies[proxy];
        proxy = proxy.split(' ');
        eventName = proxy[0];
        selector = proxy.slice(1).join(' ');

        if (method && comp[method] && comp[method]._isMethod) {
          if (eventName && selector) {
            proxyEvent(comp, eventName, selector, comp[method]);
          }
        }
      }
    }

    return comp;
  };

  Formotor.prototype.$find = function (selector) {
    return this.$el.find(selector);
  };
}

function setValues(el, data, handlers) {
  var JZComponent = JZ(el);
  var JZFormElement = JZComponent.find(':input');
  var nameMap = {};
  var currentName = void 0;

  if (!data || !Object.keys(data).length) {
    return;
  }
  handlers = handlers || {};

  while (JZFormElement.length) {
    currentName = JZFormElement.get(0).name;
    if (currentName) {
      nameMap[currentName] = JZFormElement.filter('[name="' + currentName + '"]');
      JZFormElement = JZFormElement.not('[name="' + currentName + '"]');
    } else {
      JZFormElement = JZFormElement.slice(1);
    }
  }

  JZ.each(handlers, function (name) {
    if (!nameMap[name]) {
      nameMap[name] = JZ();
    }
  });

  JZ.each(nameMap, function (name) {
    var value = data[name];
    if (isFunction(handlers[name])) {
      handlers[name].apply(this, [JZComponent, value, data]);
    } else {
      if (value != null) {
        JZ(this).formotor('setValue', value);
      }
    }
  });
}

function getValues(el, options, config$$1) {
  var JZComponent = JZ(el);

  options = JZ.extend({}, options);
  config$$1 = JZ.extend({
    trimText: true
  }, config$$1);

  return JZComponent.formotor('getValues', options, config$$1);
}

function mergeForm(Formotor) {
  Formotor.prototype.$set = function (data) {
    var comp = this;
    var model = data || comp.model;

    if (comp._disabled) {
      if (isFunction(comp.setDisabledValues)) {
        comp.setDisabledValues();
      }
      return;
    }

    if (model) {
      if (!isFunction(comp.setValues)) {
        if (!comp.$children.length) {
          comp.$setValues(model);
        } else {
          comp.$children.forEach(function (child) {
            if (data) {
              child.$set(data);
            } else {
              child.$set();
            }
          });
        }
      } else {
        comp.setValues(model);
      }
    }
  };

  Formotor.prototype.$get = function () {
    var comp = this;
    var model = void 0;

    if (comp._disabled) {
      return isFunction(comp.getDisabledValues) ? comp.getDisabledValues() : {};
    }

    if (!isFunction(comp.getValues)) {
      if (!comp.$children.length) {
        model = comp.$getValues();
      } else {
        comp.$children.forEach(function (child) {
          model = JZ.extend(model, child.$get());
        });
      }
    } else {
      model = comp.getValues();
    }

    return model;
  };

  Formotor.prototype.$setValues = function (data, handlers) {
    var comp = this;

    setValues(comp.$el, data, handlers);

    return comp;
  };

  Formotor.prototype.$getValues = function (options, config$$1) {
    var comp = this;

    return getValues(comp.$el, options, config$$1);
  };

  Formotor.prototype.$provideRef = function () {
    var comp = this;
    var data = void 0;

    if (!isFunction(comp.provideRef)) {
      data = comp.$get();
    } else {
      data = comp.provideRef();
    }

    return data;
  };

  Formotor.prototype.$callRef = function (name, entire) {
    var comp = this;
    var refs = comp.$root._refs[name];
    var data = {};

    if (!name || !refs) {
      return;
    }

    refs.forEach(function (ref) {
      data = JZ.extend(data, ref.$provideRef());
    });

    if (!entire) {
      data = data[name];
    }

    return data;
  };

  Formotor.prototype.$disable = function (status) {
    var comp = this;

    if (isUndef(status)) {
      return comp._disabled;
    }

    comp._disabled = !!status;
    if (comp._disabled) {
      comp.$el.addClass(config.disabledClasses);
    } else {
      comp.$el.removeClass(config.disabledClasses);
    }

    return comp;
  };

  Formotor.prototype.$disableFormElements = function (status, filters) {
    var comp = this;

    if (isUndef(status)) {
      status = true;
    } else {
      status = !!status;
    }
    filters = filters || '*';

    if (!isFunction(comp.disableFormElements)) {
      comp.$find(':input').filter(filters).prop('disabled', status);
    } else {
      comp.disableFormElements(status, filters);
    }

    return comp;
  };
}

function mergeEvents(Formotor) {
  Formotor.prototype._initEvents = function () {
    var comp = this;
    var events = comp.$options.events;
    comp._events = {};

    if (events) {
      var callbacks = void 0;

      var _loop = function _loop(evt) {
        callbacks = events[evt];

        if (!isArray(callbacks) && callbacks) {
          callbacks = [callbacks];
        }

        if (callbacks && callbacks.length) {
          callbacks.forEach(function (cb) {
            if (comp[cb] && comp[cb]._isMethod) {
              comp.$on(evt, comp[cb]);
            }
          });
        }
      };

      for (var evt in events) {
        _loop(evt);
      }
    }

    return comp;
  };

  Formotor.prototype.$on = function (event, fn) {
    var comp = this;
    (comp._events[event] || (comp._events[event] = [])).push(fn);
    return comp;
  };

  Formotor.prototype.$off = function (event, fn) {
    var comp = this;
    // all
    if (!arguments.length) {
      comp._events = {};
      return comp;
    }
    // specific event
    var callbacks = comp._events[event];
    if (!callbacks) {
      return comp;
    }
    if (arguments.length === 1) {
      comp._events[event] = null;
      return comp;
    }
    // specific handler
    var cb = void 0;
    var i = callbacks.length;
    while (i--) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return comp;
  };

  Formotor.prototype.$once = function (event, fn) {
    var comp = this;

    function proxy() {
      comp.$off(event, proxy);
      fn.apply(comp, arguments);
    }
    proxy.fn = fn;
    comp.$on(event, proxy);
    return comp;
  };

  Formotor.prototype.$trigger = function (event) {
    var comp = this;
    var callbacks = comp._events[event];
    if (callbacks) {
      callbacks = callbacks.length > 1 ? toArray$1(callbacks) : callbacks;
      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].apply(comp, args);
      }
    }
    return comp;
  };

  Formotor.prototype.$listen = function () {
    var comp = this;
    var args = Array.prototype.slice.call(arguments);
    comp.$root.$on.apply(comp.$root, args);
    return comp;
  };

  Formotor.prototype.$broadcast = function () {
    var comp = this;
    var args = Array.prototype.slice.call(arguments);
    comp.$root.$trigger.apply(comp.$root, args);
    return comp;
  };
}

function noop() {}

function generate(nodes) {
  nodes.forEach(function (node) {
    var code = 'with(this){_excuteNode(node, {';

    if (node.directives) {
      code += genDirectives(node) + ',';
    }

    if (node.events) {
      code += genHandlers(node) + ',';
    }

    code = code.replace(/,$/, '') + '});}';
    node.code = code;

    try {
      /* eslint-disable-next-line */
      node.render = new Function('node', node.code);
    } catch (ex) {
      node.render = noop;
    }
  });
}

function genDirectives(node) {
  var ret = 'directives:[';
  node.directives.forEach(function (dir) {
    ret += '{name:"' + dir.name + '"' + (dir.value ? ',value:(' + dir.value + '),expression:' + JSON.stringify(dir.value) : '') + (dir.arg ? ',arg:"' + dir.arg + '"' : '') + (dir.modifiers ? ',modifiers:' + JSON.stringify(dir.modifiers) : '') + '},';
  });
  return ret.slice(0, -1) + ']';
}

function genHandlers(node) {
  var ret = 'on:{';
  for (var name in node.events) {
    ret += '"' + name + '":' + genHandler(node.events[name]) + ',';
  }
  return ret.slice(0, -1) + '}';
}

function genHandler(handler) {
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: 'if($event.target !== $event.currentTarget)return;'
  };

  if (!handler || !isArray(handler) && !handler.value) {
    return 'function(){}';
  } else if (isArray(handler)) {
    return '[' + handler.map(genHandler).join(',') + ']';
  } else if (!handler.modifiers) {
    return simplePathRE.test(handler.value) ? handler.value : 'function($event){' + handler.value + '}';
  } else {
    var code = 'function($event){';
    for (var key in handler.modifiers) {
      code += modifierCode[key] || genKeyFilter(key);
    }
    var handlerCode = simplePathRE.test(handler.value) ? handler.value + '($event)' : handler.value;
    return code + handlerCode + '}';
  }
}

function genKeyFilter(key) {
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };
  var code = parseInt(key, 10) || keyCodes[key];

  if (!code) {
    return '';
  }

  if (isArray(code)) {
    return 'if(' + code.map(function (c) {
      return '$event.keyCode!==' + c;
    }).join('&&') + ')return;';
  } else {
    return 'if($event.keyCode!==' + code + ')return;';
  }
}

var dirRE = /^fm-|^@/;
var onRE = /^@|^fm-on:/;
var argRE = /:(.*)$/;
var modifierRE = /\.[^.]+/g;

function getDOMElement(el) {
  return JZ(el).get(0);
}

function scanElement(el) {
  var rootNode = {
    el: getDOMElement(el),
    nodes: [],
    subComponents: []
  };
  var parseElement = function parseElement(el) {
    var isRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var node = {
      el: getDOMElement(el),
      attrsMap: {}
    };

    var parseChildren = function parseChildren(el) {
      JZ(el).children().each(function (i, child) {
        parseElement(child);
      });
    };

    if (isRoot) {
      parseChildren(node.el);
    } else {
      processAttrs(node);

      // is component
      if (node.component) {
        if (node.dirCount > 1) {
          rootNode.nodes.push(node);
        }
        rootNode.subComponents.push({
          el: node.el,
          name: node.component
        });
      } else {
        if (node.dirCount) {
          rootNode.nodes.push(node);
        }
        parseChildren(node.el);
      }
    }

    return node;
  };

  parseElement(rootNode.el, true);
  generate(rootNode.nodes);
  return rootNode;
}

function processAttrs(node) {
  node.dirCount = 0;
  JZ.each(node.el.attributes, function (index, attr) {
    var name = attr.name;
    var value = attr.value;
    var modifiers = void 0,
        arg = void 0,
        argMatch = void 0;

    if (dirRE.test(name)) {
      node.attrsMap[name] = value;
      node.dirCount++;
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (onRE.test(name)) {
        name = name.replace(onRE, '');
        addHandler(node, name, value, modifiers);
      } else {
        name = name.replace(dirRE, '');
        argMatch = name.match(argRE);
        if (argMatch && (arg = argMatch[1])) {
          name = name.slice(0, -(arg.length + 1));
        }

        if (name === 'component') {
          node.component = value;
        } else {
          addDirective(node, name, value, arg, modifiers);
        }
      }
    }
  });
}

function parseModifiers(name) {
  var match = name.match(modifierRE);
  var ret = {};
  if (match) {
    match.forEach(function (m) {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}

function addHandler(node, name, value, modifiers) {
  var events = node.events || (node.events = {});
  var handler = {
    value: value,
    modifiers: modifiers
  };
  var currentHandler = events[name];

  if (isArray(currentHandler)) {
    currentHandler.push(handler);
  } else if (currentHandler) {
    events[name] = [currentHandler, handler];
  } else {
    events[name] = handler;
  }
}

function addDirective(node, name, value, arg, modifiers) {
  node.directives = node.directives || [];
  node.directives.push({
    name: name,
    value: value,
    arg: arg,
    modifiers: modifiers
  });
}

function applyDirective(component, node, directive, hook) {
  var def = resolveAsset(component.$options, 'directive', directive.name);
  var fn = def ? def[hook] : null;
  if (fn) {
    fn(node.el, directive, component);
  }
}

function createSubComponent(Formotor, comp, sub) {
  var asset = resolveAsset(comp.$options, 'component', sub.name);
  var options = void 0;

  if (!asset) {
    asset = resolveAsset(comp.$options, 'component', config.baseComponent);
  }
  options = JZ.extend(true, {
    el: sub.el,
    _component: sub.name,
    _parent: comp,
    _isSubComponent: true
  }, asset);

  return new Formotor(options);
}

function mergeRender(Formotor) {
  Formotor.prototype._scan = function () {
    var comp = this;
    comp._binding = scanElement(comp.$el);
    return comp;
  };

  Formotor.prototype._render = function () {
    var comp = this;
    var nodes = comp._binding.nodes;

    nodes.forEach(function (node) {
      node.render.call(comp, node);
    });

    return comp;
  };

  Formotor.prototype._excuteNode = function (node, data) {
    var comp = this;

    if (data.directives && data.directives.length) {
      data.directives.forEach(function (dir) {
        applyDirective(comp, node, dir, 'bind');
      });
    }

    if (data.on) {
      for (var key in data.on) {
        applyEvent(comp, node, key, data.on[key]);
      }
    }

    return comp;
  };

  Formotor.prototype._createSubComponent = function () {
    var comp = this;
    var subComponents = comp._binding.subComponents;
    var children = comp.$children || (comp.$children = []);

    subComponents.forEach(function (sub) {
      var subComp = createSubComponent(Formotor, comp, sub);
      if (subComp) {
        children.push(subComp);
      }
    });

    return comp;
  };

  Formotor.prototype._registerRefs = function () {
    var comp = this;
    var refs = comp.$root._refs || (comp.$root._refs = {});

    if (comp.$name) {
      (refs[comp.$name] || (refs[comp.$name] = [])).push(comp);
    }

    return comp;
  };
}

function Formotor() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._init(options);
}

mergeInit(Formotor);
mergeLifecycle(Formotor);
mergeEvents(Formotor);
mergeRender(Formotor);
mergeDOMAPIs(Formotor);
mergeForm(Formotor);

function extend(source, dest, deep) {
  if (isUndef(deep)) {
    deep = true;
  } else {
    deep = !!deep;
  }
  return JZ.extend(deep, {}, source, dest);
}

function initAssetRegisters(Formotor) {
  Formotor.options = {};
  config._assetsType.forEach(function (type) {
    Formotor.options[type + 's'] = {};
  });

  config._assetsType.forEach(function (type) {
    Formotor[type] = function (id, def) {
      if (!def) {
        return this.options[type + 's'][id];
      } else {
        this.options[type + 's'][id] = def;
        return def;
      }
    };
  });

  Formotor.component('basic', {});
}

function registryGlobalAPI(Formotor) {
  Formotor.JZ = JZ;

  Formotor.extend = extend;
  Formotor.config = configure;

  initAssetRegisters(Formotor);
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

function getValues$1(JZForm) {
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

  var getElementByName = function getElementByName(name) {
    var selector = '[name="' + name + '"],[' + postName + '="' + name + '"]';
    return JZForm.find(selector).add(JZForm.filter(selector));
  };
  JZ.each(values, function (name, value) {
    var opt = options[name];
    var JZElements = getElementByName(name);

    if (isFunction(opt)) {
      opt.apply(JZElements, [JZForm, value, values]);
    } else {
      setValue(JZElements, value);
    }
  });
  JZ.each(options, function (name, opt) {
    var JZElements = getElementByName(name);
    if (isFunction(opt) && !hasKey(values, name)) {
      opt.apply(JZElements, [JZForm, null, values]);
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

function setValues$1(JZForm) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var mergedConfig = JZ.extend(true, {}, globalConfig, config);

  renderValueToForm(JZForm, values, options, mergedConfig);
}

var valueProtoAPI = /*#__PURE__*/Object.freeze({
  getValue: getValue,
  setValue: setValue,
  getValues: getValues$1,
  setValues: setValues$1
});

var PROTO_APIS = _extends({}, valueProtoAPI);

function registryProto(Formotor) {
  // configuration
  Formotor.getProtoConfig = getConfig;
  Formotor.setProtoConfig = setConfig;

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

Formotor.version = '1.0.1';

export default Formotor;
