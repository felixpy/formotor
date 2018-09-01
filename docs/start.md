# Getting Started

## Create Form View

Let's take a simple example to demonstrate the basic use of the `Formotor` component system.

```html
<!-- HTML Template -->
<div fm-app>
    <div fm-component="foo">
        <input type="text" name="book" @change="printValue" />
    </div>
    <div fm-component="bar">
        <div fm-greet="2 + 3"></div>
        <div class="j-bar-content">Bar Content Here</div>
    </div>
</div>
```

```js
// Register the foo component with the global API
Formotor.component('foo', {
    ready: function() {
        console.log('Foo is ready now!');
    },
    methods: {
        printValue: function(e) {
            console.log(e.target.value);
        }
    }
});

var comp = new Formotor({
    el: '[fm-app]',
    ready: function() {
        console.log('Everything is ready now!');
    },
    directives: {
        greet: function(el, bindings, comp) {
            console.log('Greet:', bindings.value);
        }
    },
    components: {
        bar: {
            data: {
                msg: function() {
                    return {
                        hello: 'Hello by Bar!'
                    };
                }
            },
            proxies: {
                'click .j-bar-content': 'doSomething'
            },
            ready: function() {
                console.log('Bar is ready now!');
            },
            methods: {
                doSomething: function() {
                    console.log(this.msg.hello);
                }
            }
        }
    },
});
```

In the above example, it contains general features such as components, directives, and event bindings. You can run the example in a browser, observe the console information, and you can see the following results:

```bash
# first run
Foo is ready now!
Greet: 5
Bar is ready now!
Everything is ready now!
# change the input value to "Hey"
Hey
# click `div.j-bar-content`
Hello by Bar!
```

## Directly Manipulate Form Data

With the prototype APIs provided by Formotor, it is very convenient to get and set data from complex forms directly. These methods are very useful even if you don't use a component framework.

Suppose you have a form like the one below:

```html
<form id="sample">
  <input type="text" name="a" value="foo">
  <select name="b" multiple>
    <option selected value="1">A</option>
    <option selected value="2">B</option>
    <option value="3">C</option>
  </select>
</form>
```

Use `getValues` to get the data for the entire form:

```javascript
$('form#sample').formotor('getValues')
// { a: 'foo', b: ['1', '2'] }
```

!> Note that multi-selected form types such as checkbox and select will automatically convert to array.

And `setValues` does the opposite, backfilling the data into the entire form:

```javascript
$('form#sample').formotor('setValues', {
  a: 'bar',
  b: ['2', '3']
})
```

These methods are configurable, please refer to the documentation for details.
