const fs = require('fs');
const FILE_NAME = 'testBig.csv'
const { fork } = require('child_process');
const { checkIfExists } = require('../utils/common');
const { checkExtension } = require('../utils/validation');

let child = fork('bigFileCreator/child')

child.setMaxListeners(50)

/**
 * Calls child and waits till the data is written to the file
 * @param {fs.WriteStream} transformedData
 * @returns {Promise<void>}
 */
const callChild = async (transformedData) => {
  child.send('start')

  return new Promise(resolve => {
    child.on('message', async (data) => resolve(transformedData.write(data)))
  })
}

/**
* Function is responsible for writing to a file till it's size reaches expected range
 * After every iteration we check the size of the file
 * @param {string} fileName
 * @param {fs.WriteStream} transformedData
 */
async function write(fileName = FILE_NAME, transformedData) {
  let size = (await fs.promises.stat(fileName)).size

  while ((size / 1e6) <= 10000) {
    await callChild(transformedData)

    size = (await fs.promises.stat(fileName)).size
  }
  child.send(true)
}

/**
 * Main function which initialize whole work.
 * We need to use setTimeout to wait till the file is created
 * Else we will get error
 */
(async () => {
  const fileName = process.argv.splice(2)[0]

  if (fileName)
    checkExtension(fileName)

  let transformedData = fs.createWriteStream(fileName ?? FILE_NAME, { flags: 'a' })

  transformedData.write('cdatetime, address, district, beat, grid, crimedescr, ucr_ncic_code, latitude, longitude' + '\r\n')

  setTimeout(async () => {
    const ifExists = await checkIfExists(fileName ?? FILE_NAME)

    if (ifExists)
      await write(fileName, transformedData)

  }, 1000)
})()
