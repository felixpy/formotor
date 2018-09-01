# 入门

## 创建表单视图

下面通过一个简单的示例来演示一下 `Formotor` 组件系统的基本使用方法。

```html
<!-- HTML 模板 -->
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
// 使用全局 API 注册 foo 组件
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

在上面的例子中，包含了组件、指令、事件绑定等常用功能。你可以在浏览器中运行该例子，观察控制台信息，可以看到以下结果：

```bash
# 直接运行
Foo is ready now!
Greet: 5
Bar is ready now!
Everything is ready now!
# 改变输入框的值为 Hey
Hey
# 点击 div.j-bar-content
Hello by Bar!
```

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
