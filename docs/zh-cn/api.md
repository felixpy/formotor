# API 参考

## 全局方法

### 基本

#### config(param[, value])

- 参数：
  - `{Object | String} param`
  - `{Object} [value]`
- 用法：

  设置或获取全局配置。当`param`为对象时进行批量设置。

- 示例：

  ```js
  Formotor.config({
    silent: true,
    baseComponent: "basic"
  });
  Formotor.config("silent", false);
  Formotor.config("silent"); // false
  ```

#### component(name, definition)

- 参数：
  - `{String} name`
  - `{Object} definition`
- 用法：

  注册或获取全局组件。只传`name`时，获取组件的构造器。

- 另见：[注册组件](/zh-cn/component?id=注册)，[组件选项](/zh-cn/component?id=组件选项)

#### directive(name, definition)

- 参数：
  - `{String} name`
  - `{Object} definition`
- 用法:

  注册或获取全局指令。只传`name`时，获取指令的构造器。

- 另见：[注册指令](/zh-cn/directive?id=注册)

## 全局配置

可以通过`Formotor.config`进行设置的全局配置。

### 基本配置

#### silent

- 类型：`Boolean`
- 默认值：`false`
- 用法：

  是否打印警告信息。

#### eventHookRE

- 类型：`RegEx`
- 默认值：`/^j-/`
- 用法：

  Javascript 钩子类的模式。使用`fm-on`指令绑定事件时，若 DOM 元素拥有钩子类，则事件将会通过该类代理到组件容器上。

- 示例：

  ```html
  <div fm-app>
      <div fm-on:click="greet"></div><!-- 直接监听 -->
      <div fm-on:click="greet" class="j-foo"></div><!-- 代理监听 -->
  </div>
  ```

#### baseComponent

- 类型：`String`
- 默认值：`basic`
- 用法：

  指定未注册组件使用的构造器。

- 示例：

  ```js
  Formotor.component("my-basic", {
    // options
  });
  Formotor.config("baseComponent", "my-basic");
  ```

## 组件选项

### 基本选项

#### el

- 类型：`String | Element | jQuery`
- 限制：只需要在创建根组件时指定。
- 用法：

  指定创建根组件时的 DOM 元素。可以是选择器，DOM 元素，或 jQuery 对象。

- 另见：[元素](/zh-cn/component?id=元素)

#### data

- 类型: `Object | Function`
- 限制：
  - 若`data`中需要设置对象类型的数据，则必须通过函数返回。
  - 不能设置以`_`或`$`开头的数据。
- 用法：

  设置组件的初始数据。data 中的每个字段都会复制到组件的实例。

- 另见：[数据](/zh-cn/component?id=数据)

#### methods

- 类型: `Object`
- 限制：不能设置以`_`或`$`开头的方法。
- 用法：

  设置组件的实例方法。方法的`this`指针自动绑定到组件实例。

- 另见：[方法](/zh-cn/component?id=方法)

### 事件

#### proxies

- 类型：`Object`
- 用法：

  设置组件容器的代理事件。对象的 key 包含事件和选择器，其中从开始到第一个空格的字符串为事件名，余下的字符串为选择器。例如在`"click .j-list .j-item"`中，`click`为事件名，`.j-list .j-item`为选择器；对象的 value 为回调函数。

  若需要同时绑定多个事件，可以用竖线`|`来连接事件名。如:`change|keyup`。

- 示例：

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

- 另见：[代理事件](/zh-cn/component?id=代理事件)

#### events

- 类型：`Object`
- 用法：

  设置组件的自定义事件。对象的 key 为事件名称，对象的 value 为回调函数。

- 另见：[自定义事件](/zh-cn/component?id=自定义事件)

### 生命周期

#### init

- 类型：`Function`
- 用法：

  在组件开始初始化的时候调用。此时尚未扫描子组件。各组件的`init`方法**从上至下**递归执行。

- 示例：

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

- 类型：`Function`
- 用法：

  在组件创建完毕之后调用。此时所有子组件均已创建完毕。各组件的`ready`方法**从下至上**递归执行。

- 示例：

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

### 资源

#### components

- 类型：`Object`
- 用法：

  一个对象，包含子组件。

- 另见：[组件 - 局部注册](/zh-cn/component?id=局部注册)

#### directives

- 类型：`Object`
- 用法：

  一个对象，包含自定义指令。

- 另见：[指令 - 局部注册](/zh-cn/directive?id=局部注册)

## 实例属性

### 元素

#### $name

- 类型：`String`
- 详细：

  组件的名称。

#### $el

- 类型：`jQuery`
- 详细：

  组件依附的 DOM 元素。

#### $primary

- 类型：`jQuery`
- 详细：

  与组件名称一致的表单元素。

#### $root

- 类型：`jQuery`
- 详细：

  组件树的根组件。根组件的`$root`属性为自身。

#### $parent

- 类型：`jQuery | Null`
- 详细：

  当前组件的父组件。根组件的`$parent`为`null`。

#### $children

- 类型：`Array<jQuery>`
- 详细：

  当前组件的直接子组件。没有则为空数组。

## 实例方法

### 表单操作

#### $find(selector)

- 参数：
  - `{String} selector`
- 用法：

  在当前组件的 DOM 节点下查询元素。等同于`this.$el.find(selector)`。

#### $get()

- 用法：

  获取内部的数据模型，并将其设置到组件的`model`属性。若当前组件存在子组件，则将递归调用子组件的`$get`方法；若当前组件没有子组件，则默认通过`formotor`的`getValues`方法获取。同时，你可以通过组件的实例方法`getValues`覆盖`$get`方法的返回值。

- 示例：

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

- 用法：

  将组件自身的`model`属性展示到页面。若当前组件存在子组件，则将递归调用子组件的`$set`方法；若当前组件没有子组件，则默认通过`formotor`的`setValues`方法展示。同时，你可以通过组件的实例方法`setValues`覆盖`$set`方法的行为。

- 示例：

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

- 参数：

  - `{Object} options`
  - `{Object} config`

- 用法：

  获取当前组件下所有表单的值。参见`formotor`的`getValues`方法。

#### $setValues(data, handlers)

- 参数：

  - `{Object} data`
  - `{Object} handlers`

- 用法：

  设置当前组件下所有表单的值。参见`formotor`的`setValues`方法。

#### $callRef(name[, entire])

- 参数：

  - `{String} name`
  - `{Boolean} entire`

- 用法：

  在当前组件中引用其它组件的数据。其它组件通过调用`$provideRef`方法返回自身的数据。当`entire`为`true`时，返回完整的数据对象，默认只返回与`name`对应的值。

#### $provideRef()

- 用法：

  当其它组件需要引用当前组件的数据时，将自动调用该方法，并且默认返回`$get`方法获取的数据。也可以通过组件的实例方法`provideRef`覆盖返回的数据。

### 自定义事件

#### $on(event, callback)

- 参数：

  - `{String} event`
  - `{Function} callback`

- 用法：

  监听组件实例的自定义事件。

- 另见：[自定义事件](/zh-cn/component?id=自定义事件)

#### $once(event, callback)

- 参数：
  - `{String} event`
  - `{Function} callback`
- 用法：

  监听组件示例的自定义事件，在第一次触发之后删除监听器。

#### $off([event, callback])

- 参数：

  - `{String} [event]`
  - `{Function} [callback]`

- 用法：

  删除事件的监听器。若没有参数，则删除组件的所有自定义事件。若只有事件，则删除该事件下的使用监听器。若同事传递了事件和回调，则删除该回调对应的监听器。

#### $trigger(event[,...args])

- 参数：

  - `{String} event`
  - `[...args]`

- 用法：触发组件的自定义事件。除了事件名称，其它的参数都会直接传递给回调函数。

#### $listen(event, callback)

- 参数：

  - `{String} event`
  - `{Function} callback`

- 用法：

  监听根组件的自定义事件，用于组件间的通信。

- 另见：[组件间的通信](/zh-cn/component?id=组件间的通信)

#### $broadcast(event[,...args])

- 参数：

  - `{String} event`
  - `[...args]`

- 用法：

  触发根组件的自定义事件，用于组件间的通信。

- 另见：[组件间的通信](/zh-cn/component?id=组件间的通信)

## 内置指令

### 事件绑定

#### fm-on

- 别名：`@`
- 类型：`Function | 内联语句`
- 修饰符：
  - `.stop`，阻止事件冒泡。
  - `.prevent`，取消事件的默认动作。
  - `.self`，仅当事件是由监听器绑定的元素本身触发时才执行回调。
  - `.{keyCode | keyAlias}`，仅在指定按键按下时才执行回调。
- 用法：

  在 DOM 元素上绑定事件，事件类型由指令参数指定，并且可以通过竖线`|`连接多个事件名称。当表达式为内联语句时，会自动注入一个`$event`变量，例如：`fm-on:click="greet('Hello', $event)"`。若直接使用方法名，则会将`$event`作为第一个参数传递给对应的方法。

  如果 DOM 元素拥有由`eventHookRE`指定的类，则会将事件代理到组件容器上。这种方式通常用于可以增删的节点上。

- 示例：

  ```html
  <div fm-app>
      <div fm-component="content">
          <!-- 方法名 -->
          <input type="text" name="title" fm-on:change="smile">
          <!-- 方法表达式，手动传递参数 -->
          <input type="text" name="description" fm-on:change="cry('Cry', $event)">
          <ul class="j-list">
              <li class="j-item">
                  <span>First</span>
                  <!-- 通过 j-add-item 类代理事件 -->
                  <button type="button" class="j-add-item" @click="addItem">+</button>
              </li>
          </ul>
          <!-- 修饰符，可以同时使用多个修饰符 -->
          <button type="button" @click.stop.prevent="smile">Click Me</button>
          <!-- 修饰符，enter 为回车符的别名 -->
          <input type="text" @keyup.enter="smile"/>
          <!-- 修饰符，32 为空格符的代码 -->
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

- 另见：[代理事件](/zh-cn/component?id=代理事件)，[eventHookRE](/zh-cn/api?id=eventhookre)
