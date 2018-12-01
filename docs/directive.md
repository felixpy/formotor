# Directive

## Concept

The directive is used to bind an expression on the component's DOM node. After parsing, the component passes the value of the expression to the hook function of the directive to achieve some specific purpose. Using directives, you can easily bind DOM events or custom validation rules for forms via HTML attributes.

## Usage

### Global Registration

A global directive can be registered via the `Formotor.directive(name, hooks)` method:

```js
Formotor.directive('greet', {
  bind: function(el, bindings, comp) {
    console.log('Greet:', bindings.value);
  }
});
```

This directive can be used in the component after registration:

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

#### Hook Function

When registering an directive, the options received are a series of hook functions that are automatically triggered at different life cycles.

- **bind**: executed when the directive is first bound, and only once.

#### Arguments

When each hook function is executed, the component automatically passes the following arguments:

- **el**: The element the directive is bound to.
- **bindings**: An object that contains the following properties.
  - **name**: The name of the directive, without the `fm-` prefix.
  - **value**: The value passed to the directive. In `fm-greet="2+3"`, the value is `5`.
  - **expression**: The string corresponding to the expression. In `fm-greet="2+3"`, the expression is `"2+3"`.
  - **arg**: The argument passed to the directive. In `fm-greet:wave="2+3"`, the argument is `"wave"`.
  - **modifiers**: An object that contains modifiers. In `fm-greet.foo.bar="2+3"`, the modifiers object is `{foo:true,bar:true}`.
- **comp**: An instance of the component to which the directive belongs.

### Local Registration

For directives that do not require global registration, they can be registered with the component's `directives` option, at which point the definition of the directive only applies inside the component:

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

### Registration Synax Sugar

In some cases, the directive only needs to be executed when `bind`, in which case the function can be directly used as the registration option of the directive. E.g:

```js
Formotor.directive('greet', function(el, bindings, comp) {
  console.log('Greet:', bindings.value);
});
```

### Object Literals

Directives can bind any legal JS expression, including object literals:

```html
<div fm-app>
  <!-- bind the `msg` property of the current component -->
  <div fm-greet.var="msg"></div>
  <!-- bind strings, numbers, booleans, etc. -->
  <div fm-greet.str="'Hello'" fm-greet.num="12" fm-greet.bool="true"></div>
  <!-- binding expression -->
  <div fm-greet.exp="2+3"></div>
  <!-- binding object literals -->
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
