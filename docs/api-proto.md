# Prototype APIs Reference

## Global Config

Modify the following configuration to change the default behavior of Formotor.

### postName

- Type: `string`

- Default: `data-post-name`

- Usage:

  Customize the name of the form element.

  ```html
  <input type="text" name="a" data-post-name="alfa" value="foo">
  ```

### ignore

- Type: `string`

- Default: `.fm-ignore`

- Usage:

  Ignore specific form elements.

  ```html
  <input type="text" name="a" value="foo" class="fm-ignore">
  ```

### accessible

- Type: `string`

- Default: `.fm-accessible`

- Usage:

  Access to disabled form elements separately.

  ```html
  <input type="text" name="a" value="foo" disabled class="fm-accessible">
  ```

### disableMode

- Type: `boolean`

- Default: `false`

- Usage:

  Allow access to all disabled form elements.

### middlewares

- Type: `boolean`

- Default:

  ```javascript
  {
    trim: {
      'textarea,[type=text]': function (value = '') {
        return value.trim()
      }
    }
  }
  ```

- Usage:

  The middleware functions that process the raw values of the form.

## Global APIs

### getProtoConfig()

- Usage:

  Get all global config.

  ```javascript
  Formotor.getProtoConfig()
  ```

### getProtoConfig(key)

- Arguments:
  - `{string} key`

- Usage:

  Get the configuration of the specified key..

  ```javascript
  Formotor.getProtoConfig('ignore')
  // '.fm-ignore'
  ```

### setProtoConfig(config)

- Arguments:
  - `{object} config`

- Usage:

  Set multiple configurations at the same time.

  ```javascript
  Formotor.setProtoConfig({
    ignore: '.my-ignore',
    disableMode: true
  })
  ```

### setProtoConfig(key, value)

- Arguments:
  - `{string} key`
  - `{any} value`

- Usage:

  Set a single configuration item.

  ```javascript
  Formotor.setProtoConfig('ignore', '.my-ignore')
  ```

## Instance Methods

### getValue()

- Usage:

  Get the value of a single form element (including the checkbox group).

  ```javascript
  $('[name=a]').formotor('getValue')
  ```

### setValue(value)

- Arguments:
  - `{string|number|array} value`

- Usage:

  Set the value of a single form element (including the checkbox group). If it is a multi-select type of form element, the value can be an array.

  ```javascript
  $('[name=a][type=text]').formotor('setValue', '1')
  $('[name=b][type=checkbox]').formotor('setValue', ['1', '2'])
  ```

### getValues([options, config])

### setValues(values[, options, config])