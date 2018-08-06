# Getting Started

## Create Form View

@todo

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
