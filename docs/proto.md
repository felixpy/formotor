# Prototype APIs

## Basic Usage

Formotor can manipulate the value of an entire form or a single element.

### Entire Form

When getting the form data, Formotor iterates through each valid element in the form and aggregates their values into an object.

```html
<form id="sample">
  <input type="text" name="a" value="x" />
  <select name="b">
    <option selected value="1">A</option>
    <option value="2">B</option>
  </select>
  <input disabled type="text" name="c" value="y" />
</form>
```

!> Element `c` will not be obtained because it is disabled.

```javascript
$('form#sample').formotor('getValues');
// { a: 'x', b: '1' }
```

Backfill all the data into the form, and each key of the data is treated as the name of the form element.

```html
<form id="sample">
  <input type="text" name="a" />
  <div class="checkbox-group">
    <input type="checkbox" name="b" value="1" />
    <input type="checkbox" name="b" value="2" />
    <input type="checkbox" name="b" value="3" />
  </div>
</form>
```

```javascript
$('form#sample').formotor('setValues', {
  a: 'x',
  b: ['1', '3']
});
```

### Single Element

The values of all form elements can be collected separately.

```html
<input type="text" name="a" value="x" />

<div class="checkbox-group">
  <input type="checkbox" name="b" value="1" checked />
  <input type="checkbox" name="b" value="2" />
</div>
```

```javascript
$('[name=a]').formotor('getValue');
// 'x'

$('[name=b]').formotor('getValue');
// ['1']
```

Similarly, you can also backfill the value of a form element separately.

```html
<input type="text" name="a" />

<div class="checkbox-group">
  <input type="checkbox" name="b" value="1" />
  <input type="checkbox" name="b" value="2" />
</div>
```

```javascript
$('[name=a]').formotor('setValue', 'x');

$('[name=b]').formotor('setValue', '2');
// or
$('[name=b]').formotor('setValue', ['2']);
```

## Custom Handlers

When you manipulate the entire form, you can set your own handler for the specified form element instead of the default one.

```html
<form id="sample"><input type="text" name="a" value="xyz" /></form>
```

!> Even if there are no corresponding elements in the form, the custom handler will still take effect.

```javascript
$('form#sample').formotor('getValues', {
  a: function() {
    return 'foo';
  },
  b: function() {
    return 'bar';
  }
});
// { a: 'foo', b: 'bar' }

$('form#sample').formotor(
  'setValues',
  { a: 'foo' },
  {
    a: function($form, value, values) {
      $(this)
        .val(value)
        .attr('data-id', values.id);
    },
    b: function($form) {
      // render some text
      $form.find('span.b').text('bar');
    }
  }
);
```

## Custom Post Name

Using a custom name instead of a native property.

```html
<form id="sample">
  <input type="text" name="a" data-post-name="alfa" value="foo" />
  <input type="text" data-post-name="bravo" value="bar" />
</form>
```

```javascript
$('form#sample').formotor('getValues');
// { alfa: 'foo', bravo: 'bar' }

$('form#sample').formotor('setValues', { alfa: 'abc', bravo: 'def' });
```

## Multiple

The values of duplicate name or multi-selected form elements, are automatically converted to arrays.

```html
<form id="sample">
  <input type="text" name="a" value="11" />
  <input type="text" name="a" value="12" />
  <div class="checkbox-group">
    <input type="checkbox" name="b" value="21" />
    <input type="checkbox" name="b" value="22" checked />
    <input type="checkbox" name="b" value="23" checked />
  </div>
  <select name="c" multiple>
    <option selected value="31">A</option>
    <option value="32">B</option>
    <option selected value="33">C</option>
  </select>
</form>
```

```javascript
$('form#sample').formotor('getValues');
// { a: ['11', '12'], b: ['22', '23'], c: ['31', '33'] }
```

## Ignore

Some form elements can be ignored by the specified class.

```html
<form id="sample">
  <input type="text" name="a" value="foo" class="fm-ignore" />
  <input type="text" name="b" value="bar" />
</form>
```

```javascript
$('form#sample').formotor('getValues');
// { b: 'bar' }
```

## Disabled

Disabled elements are ignored by default. There are two ways to get the value of a disabled element.

The first way is to get the values of all disabled elements by specifying the `disableMode` configuration.

```html
<form id="sample">
  <input type="text" name="a" value="foo" disabled />
  <input type="text" name="b" value="bar" disabled />
</form>
```

```javascript
$('form#sample').formotor('getValues');
// {}

$('form#sample').formotor(
  'getValues',
  {},
  {
    disabledMode: true
  }
);
// { a: 'foo', b: 'bar' }
```

The second way is to add a class to the specified disabled element.

```html
<form id="sample">
  <input type="text" name="a" value="foo" disabled />
  <input type="text" name="b" value="bar" disabled class="fm-accessible" />
</form>
```

```javascript
$('form#sample').formotor('getValues');
// { b: 'bar' }
```

## Middlewares

The raw values obtained from the form can be handled by some middleware functions.

Formotor provides trim processing for text-type form elements by default, or you can choose to turn it off.

```html
<form id="sample">
  <input type="text" name="a" value="  foo  " />
  <input type="text" name="b" value="bar" />
</form>
```

```javascript
$('form#sample').formotor(
  'getValues',
  {},
  {
    middlewares: {
      trim: {
        'textarea,[type=text]': false
      },
      postfix: {
        '[type=text]': function(value) {
          return value + '@xyz';
        }
      }
    }
  }
);
// { a: '  foo  @xyz', b: 'bar@xyz' }
```
