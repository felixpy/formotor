const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify').uglify
const resolve = require('rollup-plugin-node-resolve')
const version = process.env.VERSION || require('../package.json').version
const banner = '/**\n * Formotor.js v' + version + '\n * (c) 2018 Felix Yang \n */'
const moduleName = 'Formotor'

const commonPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**'
  })
]
const builds = {
  'esm': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.esm.js',
      externals: ['jquery'],
      format: 'es',
      banner
    }
  },
  'umd': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.js',
      externals: ['jquery'],
      format: 'umd',
      name: moduleName,
      banner
    }
  },
  'umd-min': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins,
        uglify()
      ]
    },
    output: {
      file: 'dist/formotor.min.js',
      externals: ['jquery'],
      format: 'umd',
      name: moduleName,
      banner
    }
  },
  'zepto-esm': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.zepto.esm.js',
      externals: ['zepto'],
      format: 'es',
      banner
    }
  },
  'zepto-umd': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins
      ]
    },
    output: {
      file: 'dist/formotor.zepto.js',
      externals: ['zepto'],
      format: 'umd',
      name: moduleName,
      banner
    }
  },
  'zepto-umd-min': {
    input: {
      input: 'src/index.js',
      plugins: [
        ...commonPlugins,
        uglify()
      ]
    },
    output: {
      file: 'dist/formotor.zepto.min.js',
      externals: ['zepto'],
      format: 'umd',
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
