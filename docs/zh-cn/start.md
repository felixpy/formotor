# 入门

## 创建表单视图

@todo

## 直接操作表单数据

通过 `Formotor` 提供的原型方法，可以很方便地直接操作复杂表单的数据。即便你不使用组件系统，这些方法依然非常有用。

假设你有一个下面的表单：

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

使用 `getValues` 来获取整个表单的数据：

```javascript
$('form#sample').formotor('getValues')
// { a: 'foo', b: ['1', '2'] }
```

!> 注意多选类型的表单如 checkbox 和 select 的值会自动转化为数组。

而 `setValues` 则相反, 将数据回填到整个表单里面：

```javascript
$('form#sample').formotor('setValues', {
  a: 'bar',
  b: ['2', '3']
})
```

这些方法都是支持配置项的，请参阅文档查看详情。
