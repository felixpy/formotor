# 原型方法

## 基础用法

Formotor 可以操作整个表单或单个元素的值。

### 整个表单

在获取整个表单的数据时，Formotor 会遍历所有有效的表单元素，并把它们的值聚合到一个对象中。

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

!> 元素 `c` 不会被获取到，因为它是禁用的.

```javascript
$('form#sample').formotor('getValues')
// { a: 'x', b: '1' }
```

在将所有数据回填到表单时，数据中的每一个键都会当作表单元素的名称。

```html
<form id="sample">
  <input type="text" name="a">
  <div class="checkbox-group">
    <input type="checkbox" name="b" value="1">
    <input type="checkbox" name="b" value="2">
    <input type="checkbox" name="b" value="3">
  </div>
</form>
```

```javascript
$('form#sample').formotor('setValues', {
  a: 'x',
  b: ['1', '3']
})
```

### 单个元素

所有表单元素的值都可以单独进行收集.

```html
<input type="text" name="a" value="x">

<div class="checkbox-group">
  <input type="checkbox" name="b" value="1" checked>
  <input type="checkbox" name="b" value="2">
</div>
```

```javascript
$('[name=a]').formotor('getValue')
// 'x'

$('[name=b]').formotor('getValue')
// ['1']
```

同样，你也可以单独回填表单元素的值。

```html
<input type="text" name="a">

<div class="checkbox-group">
  <input type="checkbox" name="b" value="1">
  <input type="checkbox" name="b" value="2">
</div>
```

```javascript
$('[name=a]').formotor('setValue', 'x')

$('[name=b]').formotor('setValue', '2')
// or
$('[name=b]').formotor('setValue', ['2'])
```

## 自定义处理器

在操作整个表单时，你可以为某些表单项设置自己处理器，用来取代 Formotor 的默认行为。

```html
<form id="sample">
  <input type="text" name="a" value="xyz">
</form>
```

!> 即便表单中没有对应的元素，自定义处理器仍然会被执行。

```javascript
$('form#sample').formotor('getValues', {
  a: function () {
    return 'foo'
  },
  b: function () {
    return 'bar'
  }
})
// { a: 'foo', b: 'bar' }

$('form#sample').formotor('setValues', { a: 'foo' }, {
  a: function ($form, value, values) {
    $(this).val(value).attr('data-id', values.id)
  },
  b: function ($form) {
    // render some text
    $form.find('span.b').text('bar')
  }
})
```

## 自定义提交名称

使用自定义的名称来替代原生属性。

```html
<form id="sample">
  <input type="text" name="a" data-post-name="alfa" value="foo">
  <input type="text" data-post-name="bravo" value="bar">
</form>
```

```javascript
$('form#sample').formotor('getValues')
// { alfa: 'foo', bravo: 'bar' }

$('form#sample').formotor('setValues', { alfa: 'abc', bravo: 'def' })
```

## 多选项

多选类型或重复名称的表单元素的值，会自动转换为数组形式。

```html
<form id="sample">
  <input type="text" name="a" value="11">
  <input type="text" name="a" value="12">
  <div class="checkbox-group">
    <input type="checkbox" name="b" value="21">
    <input type="checkbox" name="b" value="22" checked>
    <input type="checkbox" name="b" value="23" checked>
  </div>
  <select name="c" multiple>
    <option selected value="31">A</option>
    <option value="32">B</option>
    <option selected value="33">C</option>
  </select>
</form>
```

```javascript
$('form#sample').formotor('getValues')
// { a: ['11', '12'], b: ['22', '23'], c: ['31', '33'] }
```

## 忽略项

可以通过指定的类来忽略某些特定的表单元素。

```html
<form id="sample">
  <input type="text" name="a" value="foo" class="fm-ignore">
  <input type="text" name="b" value="bar">
</form>
```

```javascript
$('form#sample').formotor('getValues')
// { b: 'bar' }
```

## 禁用项

禁用状态的表单元素会默认忽略。但是有两种方法可以收集禁用元素的值。

第一种方式时通过设置 `disableMode` 配置项来获取所有禁用表单元素的值。

```html
<form id="sample">
  <input type="text" name="a" value="foo" disabled>
  <input type="text" name="b" value="bar" disabled>
</form>
```

```javascript
$('form#sample').formotor('getValues')
// {}

$('form#sample').formotor('getValues', {}, {
  disabledMode: true
})
// { a: 'foo', b: 'bar' }
```

第二种方式是给指定的禁用元素添加一个类。

```html
<form id="sample">
  <input type="text" name="a" value="foo" disabled>
  <input type="text" name="b" value="bar" disabled class="fm-accessible">
</form>
```

```javascript
$('form#sample').formotor('getValues')
// { b: 'bar' }
```

## 中间件

从表单中获取的原始值可以通过一些中间件函数来进行处理。

Formotor 默认为文本类型的表单元素提供了 `trim` 处理，你也可以手动关闭它。

```html
<form id="sample">
  <input type="text" name="a" value="  foo  ">
  <input type="text" name="b" value="bar">
</form>
```

```javascript
$('form#sample').formotor('getValues', {}, {
  middlewares: {
    trim: {
      'textarea,[type=text]': false
    },
    postfix: {
      '[type=text]': function (value) {
        return value + '@xyz'
      }
    }
  }
})
// { a: '  foo  @xyz', b: 'bar@xyz' }
```