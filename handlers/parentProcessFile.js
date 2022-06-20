const { fork } = require('child_process')
const { getUserInputs } = require('../utils/common')
exports.transformToJSON = () => {
  const compute = fork('child_process/processFile.js')

  compute.send(getUserInputs())

  return new Promise((resolve, reject) => {
    compute.on('message', data => resolve(data.toString()))
    compute.on('error', error => reject(error))
  })
}
