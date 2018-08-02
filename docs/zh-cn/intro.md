# 简介

## Formotor

Formotor（意思是“表单发动机”）是一个基于 jQuery/Zepto 的轻量的、纯粹的组件框架。

它主要用于一些比较传统、庞大的后台系统。这些系统可能由于各种各样的原因，仍然在使用 jQuery 相关的技术，短时间内迁移到 Vue 等框架比较困难。Formotor（含义为表单发动机） 虽然缺少双向绑定等特性，但是它完整地实现了一个包含事件、指令的组件框架，可以让你更加清晰地组织应用代码，便于后期维护。

此外，Formotor 对表单值的获取与回填提供了非常完备的支持。即便没有使用组件系统，你仍然可以使用一些非常有用的 API 来操作表单数据。

## 安装

根据使用场景，有多种方式可以安装 Formotor。

### CDN

你可以通过 CDN 可以直接在 `script` 标签中引用 Formotor，但是必须确保在此之前添加 jQuery/Zepto。

#### jQuery

```html
<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/formotor"></script>
```

#### Zepto

```html
<script src="https://unpkg.com/zepto"></script>
<script src="https://unpkg.com/formotor"></script>
```

### NPM

如果你在使用 webpack 等构建工具，NPM 是一个更好的选择。

```bash
$ npm i formotor
```

#### jQuery

jQuery 为默认构建，直接引入即可。

```javascript
import Formotor from 'formotor'

// your code here...
```

#### Zepto

首先需要给打包工具配置一个别名 `alias`:

##### Webpack Config

```javascript
module.exports = {
  // ...
  resolve: {
    alias: {
      formotor$: 'formotor/dist/formotor.zepto.esm.js'
    }
  }
}
```