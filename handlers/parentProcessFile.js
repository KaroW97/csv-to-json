
const { fork } = require('child_process')
const { getUserInputs } = require('../utils/common')
exports.transformToJSON = () => {
  const compute = fork('child_process/transformStream.js')

  compute.send(getUserInputs())

  compute.on('error', error => error)
}

