const { fork } = require('child_process')
const { getUserInputs, getAllInputs } = require('../utils/common')
const { FileCreationError, BadRequest } = require('../utils/error')
const { loggerSuccess } = require('../utils/logger')
const { validation } = require('../utils/validation')
const { NODE_ENV } = process.env

/**
 * Function calls a child which is responsible for all
 * manipulations done on data provided by read stream
 * @returns {Promise}
 */
const transformToJSON = (processArgv) => {
  const compute = fork(__dirname + '/processFile.js')

  compute.send(getUserInputs(processArgv))

  return new Promise((resolve, reject) => {
    compute.on('message', (data) => resolve(data.toString()))
    compute.on('error', (error) => reject(error))
  })
}

/**
 * Core function, manages the flow in module
 */
const csvParser = async (processArgv) => {
  try {
    await validation(processArgv)

    await transformToJSON(processArgv)

    loggerSuccess(getAllInputs(processArgv)[3])
  } catch (err) {
    if (!(err instanceof BadRequest)) throw new FileCreationError()
    throw err
  }
}

if (NODE_ENV && NODE_ENV.trim() == 'development') {
  csvParser(process.argv)
}

module.exports = csvParser
