# API references

## Global API

### General

#### config(param[, value])

- Arguments:
  - `{Object | String} param`
  - `{Object} [value]`
- Usage:

  Set or get the global configuration. If `param` is an object, batch setting is performed.

- Example:

  ```js
  Formotor.config({
    silent: true,
    baseComponent: "basic"
  });
  Formotor.config("silent", false);
  Formotor.config("silent"); // false
  ```

### Registration

#### component(name, definition)

- Arguments:
  - `{String} name`
  - `{Object} definition`
- Usage:

  Register or get global components. If only `name` is passed, the constructor of the component is returned.

- See also: [Component Registration](/component?id=global-registration)，[Component Options](/component?id=component-options)

#### directive(name, definition)

- Arguments:
  - `{String} name`
  - `{Object} definition`
- Usage:

  Register or get global directives. If only `name` is passed, the constructor of the directive is returned.

- See also: [Directive Registration](/directive?id=global-registration)

## Global Configuration

The global configuration can be set via `Formotor.config`.

### Basic Items

#### silent

- Type: `Boolean`
- Default: `false`
- Usage:

  Whether to print a warning message.

#### eventHookRE

- Type: `RegEx`
- Default: `/^j-/`
- Usage:

  The pattern of the Javascript hook class. When binding events using the `fm-on` directive, if the DOM element has a hook class, the event will be delegated to the component container through that class.

- Example:

  ```html
  <div fm-app>
      <div fm-on:click="greet"></div><!-- directly -->
      <div fm-on:click="greet" class="j-foo"></div><!-- proxy -->
  </div>
  ```

#### baseComponent

- Type: `String`
- Default: `basic`
- Usage:

  Specifies the constructor used by unregistered components.

- Example:

  ```js
  Formotor.component("my-basic", {
    // options
  });
  Formotor.config("baseComponent", "my-basic");
  ```

## Component Options

### Basic Items

#### el

- Type: `String | Element | jQuery`
- Limit: It only needs to be specified when creating the root component.
- Usage:

  Specifies the DOM element when the root component is created. Can be a selector, a DOM element, or a jQuery object.

- See also: [Element](/component?id=element)

#### data

- Type: `Object | Function`
- Limit:
  - If you need to set the object literals in `data`, you must return it through the function.
  - You cannot set data starting with `_` or `$`.
- Usage:

  Set the initial data for the component. Each field in data is copied to the instance of the component.

- See also: [Data](/component?id=data)

#### methods

- Type: `Object`
- Limit: You cannot set a method that starts with `_` or `$`.
- Usage:

  Set the instance method of the component. The `this` pointer of the method is automatically bound to the component instance.

- See also: [Methods](/component?id=methods)

### Events

#### proxies

- Type: `Object`
- Usage:

  Set the proxy event for the component container. The object's key contains the event and selector, where the string from the beginning to the first space is the event name and the remaining string is the selector. For example, in `"click .j-list .j-item"`, `click` is the event name, `.j-list .j-item` is the selector; the value of the object is the callback function.

  If you need to bind multiple events at the same time, you can use the vertical line `|` to connect to the event name. Such as: `change|keyup`.

- Example:

  ```js
  Formotor.component("foo", {
    proxies: {
      "click .j-list .j-item": "showDetail"
    },
    methods: {
      showDetail: function(event) {
        console.log("Detail");
      }
    }
  });
  ```

- See also: [Proxy Events](/component?id=proxy-events)

#### events

- Type: `Object`
- Usage:

  Set custom events for the component. The object's key is the event name, and the object's value is the callback function.

- See also: [Custom Events](/component?id=custom-events)

### Lifecycle

#### init

- Type: `Function`
- Usage:

  Called when the component starts to initialize. The subcomponents have not been scanned at this time. The `init` method of each component is recursively executed from **top to bottom**.

- Example:

  ```html
  <div fm-app>
      <div fm-component="child">
      </div>
  </div>
  ```

  ```js
  new Formotor({
    el: "[fm-app]",
    init: function() {
      console.log("Root init");
    },
    components: {
      child: {
        init: function() {
          console.log("Child init");
        }
      }
    }
  });

  // Root init
  // Child init
  ```

#### ready

- Type: `Function`
- Usage:

  Called after the component has been created. All subcomponents have been created at this point. The `ready` method of each component is recursively executed from **bottom to top**.

- Example:

  ```html
  <div fm-app>
      <div fm-component="child">
      </div>
  </div>
  ```

  ```js
  new Formotor({
    el: "[fm-app]",
    ready: function() {
      console.log("Root ready");
    },
    components: {
      child: {
        ready: function() {
          console.log("Child ready");
        }
      }
    }
  });

  // Child ready
  // Root ready
  ```

### Assets

#### components

- Type: `Object`
- Usage:

  An object that contains the definition of all local subcomponents.

- See also: [Component - Local Registration](/component?id=local-registration)

#### directives

- Type: `Object`
- Usage:

  An object that contains the definition of all local directives.

- See also: [Directive - Local Registration](/directive?id=local-registration)

## Instance Properties

### Element

#### $name

- Type: `String`
- Detail:

  The name of the component.

#### $el

- Type: `jQuery`
- Detail:

  The DOM element that the component is mounted on.

#### $primary

- Type: `jQuery`
- Detail:

  A form element that is consistent with the component name.

#### $root

- Type: `jQuery`
- Detail:

  The root component of the component tree. The `$root` attribute of the root component is itself.

#### $parent

- Type: `jQuery | Null`
- Detail:

  The parent component of the current component. The `$parent` of the root component is `null`.

#### $children

- Type: `Array<jQuery>`
- Detail:

  The immediate subcomponent of the current component. It is an empty array if there are no child components.

## Instance Methods

### Form

#### $find(selector)

- Arguments:
  - `{String} selector`
- Usage:

  Query elements under the DOM node of the current component. Equivalent to `this.$el.find(selector)`.

#### $get()

- Usage:

  Get the internal data model and set it to the `model` property of the component. If there is a subcomponent in the current component, the `$get` method of the subcomponent will be called recursively; if the current component has no subcomponents, it is obtained by the `getValue` method of `formotor` by default. At the same time, you can override the return value of the `$get` method via the component's instance method `getValues`.

- Example:

  ```html
  <div fm-app>
      <div fm-component="foo">
          <input type="text" name="foo" value="Hello"/>
      </div>
      <div fm-component="bar">
          <input type="text" name="bar" value="World"/>
      </div>
  <div>
  ```

  ```js
  var comp = new Formotor({
    el: "[fm-app]",
    components: {
      foo: {},
      bar: {
        methods: {
          getValues: function() {
            return {
              "bar-plus": "World Plus"
            };
          }
        }
      }
    }
  });
  var data = JSON.stringify(comp.$get());
  console.log(data);

  // {"foo":"Hello","bar-plus":"World Plus"}
  ```

#### $set()

- Usage:

  Display the component's own `model` property to the page. If there is a subcomponent in the current component, the `$set` method of the subcomponent will be called recursively; if the current component has no subcomponents, it will be displayed by `setValues` method of `formotor` by default. At the same time, you can override the behavior of the `$set` method with the component's instance method `setValues`.

- Example:

  ```html
  <div fm-app>
      <div fm-component="foo">
          <input type="text" name="foo"/>
      </div>
      <div fm-component="bar">
          <input type="text" name="bar"/>
      </div>
  </div>
  ```

  ```js
  var comp = new Formotor({
    el: "[fm-app]",
    data: {
      model: function() {
        return {
          foo: "Apple",
          bar: "Pear",
          barSize: "Small"
        };
      }
    },
    components: {
      foo: {},
      bar: {
        methods: {
          setValues: function(data) {
            var $bar = this.$primary;
            $bar.val(data.bar).attr("data-size", data.barSize);
            console.log("Set attribute data-size:", $bar.attr("data-size"));
          }
        }
      }
    }
  });
  comp.$set();

  // Set attribute data-size: Small
  ```

#### $getValues(options, config)

- Arguments:

  - `{Object} options`
  - `{Object} config`

- Usage:

  Get the values of all form elements under the current component. See the `getValues` method of `formotor`.

#### $setValues(data, handlers)

- Arguments:

  - `{Object} data`
  - `{Object} handlers`

- Usage:

  Sets the value of all form elements under the current component. See the `setValues` method of `formotor`.

#### $callRef(name[, entire])

- Arguments:

  - `{String} name`
  - `{Boolean} entire`

- Usage:

  Reference data from other components in the current component. Other components return their own data by calling the `$provideRef` method. When `entire` is `true`, the complete data object is returned. By default, only the value corresponding to `name` is returned.

#### $provideRef()

- Usage:

  This method is called automatically when other components need to reference the data of the current component, and the data obtained by the `$get` method is returned by default. The returned data can also be overridden by the component's instance method `provideRef`.

### Custom Events

#### $on(event, callback)

- Arguments:

  - `{String} event`
  - `{Function} callback`

- Usage:

  Listen for custom events for component instances.

- See also: [Custom Events](/component?id=custom-events)

#### $once(event, callback)

- Arguments:
  - `{String} event`
  - `{Function} callback`
- Usage:

  Listen for custom events for component instances, removing listeners after the first trigger.

#### $off([event, callback])

- Arguments:

  - `{String} [event]`
  - `{Function} [callback]`

- Usage:

  Remove the listener for the event. If there are no parameters, delete all custom events for the component. If there is only an event, all listeners under that event are deleted. If the colleague passes the event and the callback, only the listener corresponding to the callback is deleted.

#### $trigger(event[,...args])

- Arguments:

  - `{String} event`
  - `[...args]`

- Usage: Triggers a custom event for the current component. In addition to the event name, other parameters are passed directly to the callback function.

#### $listen(event, callback)

- Arguments:

  - `{String} event`
  - `{Function} callback`

- Usage:

  A custom event that listens to the root component for communication between components.

- See also: [Communication between Components](/component?id=communication-between-components)

#### $broadcast(event[,...args])

- Arguments:

  - `{String} event`
  - `[...args]`

- Usage:

  A custom event that triggers the root component, used with the `$listen` method for communication between components.

- See also: [Communication between Components](/component?id=communication-between-components)

## Built-in Directives

### DOM Events

#### fm-on

- alias: `@`
- Type: `Function | Inline Statement`
- Modifiers:
  - `.stop`, call `event.stopPropagation()`.
  - `.prevent`, call `event.preventDefault()`.
  - `.self`, only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}`, only trigger handler on certain keys.
- Usage:

  Bind events on the DOM element, the event type is specified by the directive parameter, and multiple event names can be joined by the vertical bar `|`. When the expression is an inline statement, a `$event` variable is automatically injected, for example: `fm-on:click="greet('Hello', $event)"`. If the method name is used directly, `$event` will be passed as the first parameter to the corresponding method.

  If the DOM element has a class specified by `eventHookRE`, the event is proxied to the component container. This method is usually used on nodes that can be added or deleted.

- Example:

  ```html
  <div fm-app>
      <div fm-component="content">
          <!-- only method name -->
          <input type="text" name="title" fm-on:change="smile">
          <!-- method expression, passing parameters manually -->
          <input type="text" name="description" fm-on:change="cry('Cry', $event)">
          <ul class="j-list">
              <li class="j-item">
                  <span>First</span>
                  <!-- proxy event via `j-add-item` class -->
                  <button type="button" class="j-add-item" @click="addItem">+</button>
              </li>
          </ul>
          <!-- modifiers, you can use multiple modifiers at the same time -->
          <button type="button" @click.stop.prevent="smile">Click Me</button>
          <!-- modifier, `enter` is the alias of the carriage return -->
          <input type="text" @keyup.enter="smile"/>
          <!-- modifier, `32` is the code for the space character -->
          <input type="text" @keyup.32="smile"/>
      </div>
  </div>
  ```

  ```js
  new Formotor({
    el: "[fm-app]",
    components: {
      content: {
        methods: {
          smile: function(event) {
            console.log("Smile");
          },
          cry: function(msg, event) {
            console.log(msg);
          },
          addItem: function(event) {
            console.log("Add Item");
          }
        }
      }
    }
  });
  ```

- See also: [Proxy Events](/component?id=proxy-events)，[eventHookRE](/api?id=eventhookre)
