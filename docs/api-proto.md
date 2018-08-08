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
  - `{ [key: string]: any } config`

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

- Arguments:
  - `{ [key: string]: function } options`
  - `{ [key: string]: any } config`

- Usage:

  Get values with optional custom handlers and local configuration.

  Each handler in `options` taking two arguments:

    - `{jquery} $form` - The form that calls the `getValues` method.
    - `{object} referValues` - Original values that collected by Formotor.

  The `config` parameter is used to override the global configuration, and the supported fields are exactly the same.
  
  In addition, `this` will point to the corresponding form element.

  ```javascript
  const options = {
    a: function ($form, referValues) {
      return referValues.a + '@postfix'
    },
    b: function ($form, referValues) {
      return $(this).val() + referValues.c
    }
  }
  const config = {
    ignore: '.my-ignore'
  }

  $('form#sample').formotor('getValues', options, config)
  ```

- See also: [Custom Handlers](/proto?id=custom-handlers), [Global Config](/api-proto?id=global-config)

### setValues(values[, options, config])

- Arguments:
  - `{ [key: string]: any } values`
  - `{ [key: string]: function } options`
  - `{ [key: string]: any } config`
    - `{string} postName`

- Usage:

  Set values with optional custom handlers and local configuration.

  Each handler in `options` taking three arguments:

    - `{jquery} $form` - The form that calls the `getValues` method.
    - `{string|number|array} value` - The value of current form element.
    - `{object} referValues` - All values of the form.

  The `config` parameter is used to override the global configuration, and the supported fields are exactly the same.
  
  In addition, `this` will point to the corresponding form element.


  ```javascript
  const values = {
    a: 1,
    b: 2,
    x: 3
  }
  const options = {
    a: function ($form, value, referValues) {
      $(this).val(value).attr('data-id', referValues.x)
    },
    b: function ($form, value referValues) {
      $form.find('.some-custom-widget').customWidget('setValue', value)
    }
  }
  const config = {
    postName: 'data-name'
  }

  $('form#sample').formotor('setValues', values, options, config)
  ```

- See also: [Custom Handlers](/proto?id=custom-handlers), [Global Config](/api-proto?id=global-config)