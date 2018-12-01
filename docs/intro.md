# Introduction

## Formotor

Formotor(means "form motor") is a lightweight and pure component framework based on jQuery/Zepto. It is mainly used for some more traditional and huge back-end systems. These systems may still use jQuery-related technologies for a variety of reasons, and it is difficult to migrate to a framework such as Vue in a short period of time.

Formotor lacks features such as two-way binding, but it completely implements a component framework that contains events and directives, allowing you to more clearly organize your application code for later maintenance.

In addition, Formotor provides very complete support for the acquisition and backfilling of form values. Even if you don't use a component system, you can still use some very useful APIs to manipulate form data.

## Installation

There are several ways to install Formotor depending on the usage scenario.

### CDN

You can include Formotor directly with a `script` tag via CDN, but you must make sure to add jQuery/Zepto before this.

#### jQuery

```html
<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/formotor"></script>
```

#### Zepto

```html
<script src="https://unpkg.com/zepto"></script>
<script src="https://unpkg.com/formotor/dist/formotor.zepto.js"></script>
```

### NPM

If you are using a build tool such as webpack, NPM is a better choice.

```bash
$ npm i formotor
```

#### jQuery

JQuery is the default build and can be imported directly.

```javascript
import Formotor from 'formotor';

// your code here...
```

#### Zepto

You need to configure an alias in your bundler first:

##### Webpack Config

```javascript
module.exports = {
  // ...
  resolve: {
    alias: {
      formotor$: 'formotor/dist/formotor.zepto.esm.js'
    }
  }
};
```
