const { fork } = require('child_process')
const { getUserInputs, getAllInputs } = require('../utils/common')
const { FileCreationError, BadRequest } = require('../utils/error')
const { loggerSuccess } = require('../utils/logger')
const { validation } = require('../utils/validation')

/**
 * Function calls a child which is responsible for all
 * manipulations done on data provided by read stream
 * @returns {Promise}
 */
const transformToJSON = () => {
  const compute = fork(__dirname + '/processFile.js')

  compute.send(getUserInputs())

  return new Promise((resolve, reject) => {
    compute.on('message', (data) => resolve(data.toString()))
    compute.on('error', (error) => reject(error))
  })
}

  /**
   * Core function, manages the flow in module
   */
  ; (async () => {
    try {
      await validation()

      await transformToJSON()

      loggerSuccess(getAllInputs()[3])
    } catch (err) {
      if (!(err instanceof BadRequest)) throw new FileCreationError()
      throw err
    }
  })()
