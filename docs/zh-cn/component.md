# 组件

## 概念

组件是 Formotor Component 最核心的功能。每个组件都是一个独立的容器，对自己的业务逻辑进行了封装。

## 使用方法

### 注册

通过`Formotor.component(name, options)`方法可以注册一个全局组件：

```js
Formotor.component('example', {
  // options
});
```

组件注册之后，就可以在 HTML 中使用该组件：

```html
<div fm-app><div fm-component="example"></div></div>
```

```js
new Formotor({
  el: '[fm-app]'
});
```

对于没有注册的组件，Formotor Component 会自动使用一个空白组件作为它的构造器。你也可以注册一个基础组件，作为所有未注册组件的构造器：

```js
Formotor.component('basic', {
  // options of basic component
});
```

### 局部注册

对于不需要全局注册的组件，可以通过父组件的`components`选项进行注册，此时组件的定义仅作用于父组件内部：

```js
new Formotor({
  el: '[fm-app]',
  components: {
    // 注册 example 组件
    example: {
      // options
    }
  }
});
```

### 组件选项

#### 元素

根组件的构造器需要通过`el`选项指定依附的 DOM 节点。

```html
<div fm-app id="app"><div fm-component="content"></div></div>
```

```js
// 注册content组件
Formotor.component('content', {
  // options，不需要指定 el 选项
});
// 通过指定的元素生成组件树
var comp = new Formotor({
  el: '[fm-app]' // 也可以使用 '#app'
});
```

#### 数据

组件的构造器可以接收一个`data`选项作为组件的初始数据。需要注意的是，如果`data`中的某个字段是一个对象直接量，那么多个组件的实例将会共享该对象。这种情况下，应该使用函数代替对象直接量：

```js
// data.foo 是一个对象直接量
var comp = new Formotor({
  el: '[fm-app]',
  data: {
    foo: {
      bar: 1
    },
    greet: 'hello'
  }
});
```

第一种替代方式，`data.foo`为函数：

```js
var comp = new Formotor({
  el: '[fm-app]',
  data: {
    foo: function() {
      return {
        bar: 1
      };
    },
    greet: 'hello'
  }
});
```

第二种替代方式，`data`为函数：

```js
var comp = new Formotor({
  el: '[fm-app]',
  data: function() {
    return {
      foo: {
        bar: 1
      },
      greet: 'hello'
    };
  }
});
```

打印组件中由`data`生成的属性，可以得到如下结果：

```js
console.log(comp.foo['bar']); // 1
console.log(comp.greet); // hello
```

#### 模型

通过`data`选项，还可以设置一个特殊的数据`model`，该数据将作为调用组件`$set`方法时的依赖。若子组件未指定`model`，则将自动继承父组件的`model`。

```js
new Formotor({
  el: '[fm-app]',
  data: {
    model: function() {
      return {
        foo: 1,
        bar: 2
      };
    }
  },
  components: {
    bar: {
      ready: function() {
        console.log(this.model.foo, this.model.bar);
      }
    }
  }
});

// 1 2
```

#### 方法

与`data`类似，组件可以接收一个`methods`选项，作为组件的实例方法：

```js
var comp = new Formotor({
  el: '[fm-app]',
  methods: {
    greet: function() {
      console.log('Say Hello!');
      this.cheer('Nice Day!');
    },
    cheer: function(msg) {
      console.log(msg);
    }
  }
});

comp.greet();
// Say Hello!
// Nice Day!
```

#### 代理事件

可以通过`proxies`选项，指定需要代理到组件容器上的 DOM 事件（通过 jQuery）：

```html
<div fm-app>
  <div fm-component="foo">
    <div class="j-content">Content: Click Here</div>
    <div class="j-content">Another Content: Click Here</div>
    <div class="j-footer" @click="greet($event, 'By Footer!');">
      Footer: Click Here
    </div>
    <div class="j-footer">Another Footer: Click Here</div>
  </div>
</div>
```

```js
var comp = new Formotor({
  el: '[fm-app]',
  components: {
    foo: {
      proxies: {
        'click .j-content': 'greet'
      },
      methods: {
        greet: function(event, msg) {
          msg = msg || '';
          console.log('Say Hello!' + msg);
        }
      }
    }
  }
});

// 点击任意 div.j-content > Say Hello!
// 点击任意 div.j-footer  > Say Hello!By Footer!
```

从上面的例子中可以看出`div.j-footer`上的`click`事件也是代理的，这是因为通过`fm-on:`或`@`绑定的事件，如果元素拥有指定格式的类（以`j-`开头的类），则该事件也会通过这些类代理到组件容器上。所以`div.j-footer`的`click`事件，实际上是通过下面的形式进行监听的：

```js
comp.$el.on('click', '.j-footer', function(e) {
  comp.greet(e, 'By Footer');
});
```

#### 自定义事件

除了 DOM 事件，Formotor Component 还拥有自己的自定义事件系统。可以通过`events`选项监听事件，也可以通过实例方法手动监听事件：

```js
var comp = new Formotor({
  el: '[fm-app]',
  events: {
    'act:smile': 'smile'
  },
  methods: {
    smile: function(msg) {
      console.log('Smile:', msg);
    },
    cry: function(msg) {
      console.log('Cry:', msg);
    }
  }
});
comp.$on('act:cry', comp.cry);

comp.$trigger('act:smile', '23333'); // Smile: 23333
comp.$trigger('act:cry', '55555'); // Cry: 55555
```

### 组件间的通信

虽然 Formotor Component 组件之间是彼此独立的，但是在实际使用过程中，一个组件可能会需要根据其它组件的状态来同步自身的状态，所以组件之间需要一种能够互相通信的机制。

一种不好的方式就是在一个组件中直接改变其它组件的状态或直接调用其它组件的实例方法，这违背了组件独立的原则，会导致组件之间的关系错综复杂，难以维护。因此在 Formotor Component 中，是通过根组件来集中处理组件之间的通信消息的。具体方式如下：

> 假设组件 A 需要根据组件 B 的状态做相应的操作。则由组件 A 在根组件上监听一个事件 X，当 B 的状态改变后，触发根组件的事件 X，A 在相应的回调函数中执行相应的操作。

实际使用过程中，组件通过`$listen`方法监听根组件的事件来响应消息，通过`$broadcast`方法触发根组件的事件来传递消息。下面是一个简单的例子：

```html
<div fm-app>
  <div fm-component="foo">
    <input type="text" name="status" @change="updateStatus" />
  </div>
  <div fm-component="bar"><div class="j-status"></div></div>
</div>
```

```js
new Formotor({
  el: '[fm-app]',
  components: {
    foo: {
      methods: {
        updateStatus: function(e) {
          this.$broadcast('foo:change', e.target.value);
        }
      }
    },
    bar: {
      ready: function() {
        this.listen();
      },
      methods: {
        listen: function() {
          this.$listen('foo:change', this.showStatus);
        },
        showStatus: function(status) {
          this.$find('.j-status').text(status);
        }
      }
    }
  }
});
```

运行该例子可以发现，当组件`foo`中输入框的值改变后，会同步显示到组件`bar`的`div.j-status`中。
