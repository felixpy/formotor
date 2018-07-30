const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify').uglify
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const version = process.env.VERSION || require('../package.json').version
const banner = '/**\n * Formotor.js v' + version + '\n * (c) 2018 Felix Yang \n */'
const moduleName = 'Formotor'

const commonPlugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**'
  })
]
const uglifyOptions = {
  output: {
    comments: function (node, comment) {
      if (comment.type === 'comment2') {
        return /(c)/i.test(comment.value)
      }
    }
  }
}
const builds = {
  'esm': {
    input: {
      input: 'src/index.js',
      external: ['jquery'],
      plugins: [
        replace({
          __VERSION__: version
        }),
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.esm.js',
      format: 'es',
      banner
    }
  },
  'umd': {
    input: {
      input: 'src/index.js',
      external: ['jquery'],
      plugins: [
        replace({
          __VERSION__: version
        }),
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.js',
      format: 'umd',
      globals: {
        jquery: 'jQuery'
      },
      name: moduleName,
      banner
    }
  },
  'umd-min': {
    input: {
      input: 'src/index.js',
      external: ['jquery'],
      plugins: [
        replace({
          __VERSION__: version
        }),
        ...commonPlugins,
        uglify(uglifyOptions)
      ]
    },
    output: {
      file: 'dist/formotor.min.js',
      format: 'umd',
      globals: {
        jquery: 'jQuery'
      },
      name: moduleName,
      banner
    }
  },
  'zepto-esm': {
    input: {
      input: 'src/index.js',
      external: ['zepto'],
      plugins: [
        replace({
          jquery: 'zepto',
          __VERSION__: version
        }),
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.zepto.esm.js',
      format: 'es',
      banner
    }
  },
  'zepto-umd': {
    input: {
      input: 'src/index.js',
      external: ['zepto'],
      plugins: [
        replace({
          jquery: 'zepto',
          __VERSION__: version
        }),
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.zepto.js',
      format: 'umd',
      globals: {
        zepto: 'Zepto'
      },
      name: moduleName,
      banner
    }
  },
  'zepto-umd-min': {
    input: {
      input: 'src/index.js',
      external: ['zepto'],
      plugins: [
        replace({
          jquery: 'zepto',
          __VERSION__: version
        }),
        ...commonPlugins,
        uglify(uglifyOptions)
      ]
    },
    output: {
      file: 'dist/formotor.zepto.min.js',
      format: 'umd',
      globals: {
        zepto: 'Zepto'
      },
      name: moduleName,
      banner
    }
  }
}

const genConfig = function (name) {
  const buildConfig = builds[name]
  const config = Object.assign({
  }, buildConfig)

  return config
}

exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
