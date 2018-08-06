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

### setProtoConfig(config)

### setProtoConfig(key, value)

## Instance Methods

### getValue()

### setValue(value)

### getValues([options, config])

### setValues(values[, options, config])