# Prototype APIs Guide

## Common usage

### Getting Form Values

When getting the form data, Formotor iterates through each valid element in the form and aggregates their values into an object.

```html
<form id="sample">
  <input type="text" name="a" value="x">
  <select name="b">
    <option selected value="1">A</option>
    <option value="2">B</option>
  </select>
  <input disabled type="text" name="c" value="y">
</form>
```

!> Field `c` will not be obtained because it is disabled.

```javascript
$('form#sample').formotor('getValues')
// { a: 'x', b: '1' }
```

### Setting Form Values

### Getting Element Value

### Setting Element Value

## Custom Handlers

## Custom Post Name

## Multiple

## Ignore

## Disabled

## Middlewares