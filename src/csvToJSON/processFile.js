const fs = require('fs')
const { transform, setInitialSeparator } = require('./transform')

/**
 * Function creates new file after some manipulations on the old one are done
 * @param {string} param0
 * @returns {Promise}
 */
const transformStream = async ({ inputPath, outputPath, separatorType }) => {
  console.log({ inputPath, outputPath, separatorType });
  //Create streams
  const fileStream = fs.createReadStream(inputPath, { encoding: 'utf-8' })
  const writeStream = fs.createWriteStream(outputPath, { flags: 'a' })

  //Checks if separatorType was given
  //If so, function is called and value is passed to the class instance
  if (separatorType) setInitialSeparator(separatorType)

  //transaction between readStream and writeStream
  fileStream.pipe(transform).pipe(writeStream)

  //Resolve when writeStream close or reject if error
  return new Promise((resolve, rejects) => {
    writeStream.on('close', () => resolve(true))
    writeStream.on('error', (error) => rejects(error))
  })
}

('message', async (inputs) => {
  const data = await transformStream(inputs)
  process.send(data)
  process.exit()
})
