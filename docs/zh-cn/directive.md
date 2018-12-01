# 指令

## 概念

指令用于在组件的 DOM 节点上绑定表达式，解析之后，组件会将表达式的值传递给指令的钩子函数，实现某些特定的功能。使用指令，可以很方便地通过 HTML 属性绑定事件或表单的自定义校验规则。

## 使用方法

### 注册

通过`Formotor.directive(name, hooks)`方法可以注册一个全局指令：

```js
Formotor.directive('greet', {
  bind: function(el, bindings, comp) {
    console.log('Greet:', bindings.value);
  }
});
```

注册之后就可以在组件中使用该指令：

```html
<div fm-app>
  <div fm-greet="msgX"></div>
  <div fm-greet="msgY"></div>
</div>
```

```js
new Formotor({
  el: '[fm-app]',
  data: {
    msgX: 'Hello X!',
    msgY: 'Hello Y!'
  }
});

// Greet: Hello X!
// Greet: Hello Y!
```

#### 钩子函数

注册指令时，接收的选项是一系列钩子函数，这些函数会在不同的时机自动触发。

- **bind**: 在指令第一次绑定的时候执行，仅执行一次。

#### 参数

每个钩子函数在执行时，组件会自动传递以下参数：

- **el**: 指令绑定的元素。
- **bindings**: 包含以下属性的对象。
  - **name**: 指令的名称，不包含`fm-`前缀。
  - **value**: 传递给指令的值。在`fm-greet="2+3"`中，值为`5`。
  - **expression**: 表达式对应的字符串。在`fm-greet="2+3"`中，表达式为`"2+3"`。
  - **arg**: 传递给指令的参数。在`fm-greet:wave="2+3"`中，参数为`"wave"`。
  - **modifiers**: 包含指令修饰符的对象。在`fm-greet.foo.bar="2+3"`中，修饰符为`{foo:true,bar:true}`。
- **comp**: 指令所属组件的实例。

### 局部注册

对于不需要全局注册的指令，可以通过组件的`directives`选项进行注册，此时指令的定义仅作用于该组件内部：

```js
new Formotor({
  el: '[fm-app]',
  directives: {
    greet: {
      bind: function(el, bindings, comp) {
        console.log('Greet:', bindings.value);
      }
    }
  }
});
```

### 注册语法糖

一些情况下，指令仅需要在`bind`的时候执行，此时可以直接将函数作为指令的注册选项。例如：

```js
Formotor.directive('greet', function(el, bindings, comp) {
  console.log('Greet:', bindings.value);
});
```

### 对象字面量

指令可以绑定任意合法的 JS 表达式，包括对象字面量：

```html
<div fm-app>
  <!-- 绑定组件的 msg 属性 -->
  <div fm-greet.var="msg"></div>
  <!-- 绑定字符串、数字、布尔值等直接量 -->
  <div fm-greet.str="'Hello'" fm-greet.num="12" fm-greet.bool="true"></div>
  <!-- 绑定表达式 -->
  <div fm-greet.exp="2+3"></div>
  <!-- 绑定对象字面量 -->
  <div fm-greet.obj="{x:false,y:2+3,z:msg}"></div>
</div>
```

```js
new Formotor({
  el: '[fm-app]',
  data: {
    msg: 'Good Morning'
  },
  directives: {
    greet: function(el, bindings, comp) {
      console.log('Greet:', JSON.stringify(bindings.value));
    }
  }
});

// Greet: "Good Morning"
// Greet: "Hello"
// Greet: 12
// Greet: true
// Greet: 5
// Greet: {"x":false,"y":5,"z":"Good Morning"}
```
