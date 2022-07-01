const fs = require('fs')
const os = require('os')

const FILE_NAME = `C:/Users/${os.userInfo().username}/Desktop/randomFile.csv`
const { fork } = require('child_process')
const { checkIfExists } = require('../utils/common')
const { checkCreateFileInputs } = require('../utils/validation')
const { FileCreationError, BadRequest } = require('../utils/error')
const { loggerSuccess } = require('../utils/logger')
let child = fork(__dirname + '/child')

child.setMaxListeners(50)

/**
 * Calls child and waits till the data is written to the file
 * @param {fs.WriteStream} transformedData
 * @returns {Promise<void>}
 */
const callChild = async (transformedData) => {
  child.send('start')

  return new Promise((resolve) => {
    child.on('message', async (data) => resolve(transformedData.write(data)))
  })
}

/**
 * Function is responsible for writing to a file till it's size reaches expected range
 * After every iteration we check the size of the file
 * @param {string} filePath
 * @param {fs.WriteStream} transformedData
 */
async function write(filePath = FILE_NAME, transformedData, fileSize = 10) {
  let size = (await fs.promises.stat(filePath)).size

  while (size / 1e6 <= fileSize * 1000) {
    await callChild(transformedData)

    size = (await fs.promises.stat(filePath)).size
  }
  child.send(true)
}

/**
 * Core function, manages the flow in module.
 * We need to use setTimeout to wait till the file is created
 * Else we will get error
 */

const bigFile = async (processArgv) => {
  try {
    const { filePath, size } = checkCreateFileInputs(processArgv) || {}

    const file = filePath ?? FILE_NAME

    let transformedData = fs.createWriteStream(file, { flags: 'a' })

    transformedData.write(
      'cdatetime, address, district, beat, grid, crimedescr, ucr_ncic_code, latitude, longitude' +
        '\r\n'
    )

    setTimeout(async () => {
      const ifExists = await checkIfExists(file)

      if (ifExists) {
        await write(file, transformedData, size)

        loggerSuccess(file)
      }
    }, 1000)
  } catch (err) {
    if (err instanceof TypeError) throw err
    if (!(err instanceof BadRequest)) throw new FileCreationError(err.message)
    throw err
  }
}

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() == 'development') {
  bigFile(process.argv)
}

module.exports = bigFile
