const rollup = require('rollup')
const builds = require('./config').getAllBuilds()

async function build (config) {
  const { input: inputOptions, output: outputOptions } = config
  const bundle = await rollup.rollup(inputOptions)

  await bundle.write(outputOptions)

  console.log('\x1b[1m\x1b[34m' + outputOptions.file + '\x1b[39m\x1b[22m')
}

function buildAll () {
  const len = builds.length
  let i = 0

  const execTask = () => {
    build(builds[i]).then(() => {
      i++
      if (i < len) {
        execTask()
      }
    }).catch(err => {
      console.log(err)
    })
  }

  execTask()
}

buildAll()
