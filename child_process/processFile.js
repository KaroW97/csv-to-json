const fs = require('fs');
const { transform, setInitialSeparator } = require('./transform');

const transformStream = async ({ inputPath, outputPath, separatorType }) => {
  const fileStream = fs.createReadStream(inputPath, { encoding: 'utf-8' })
  const transformedData = fs.createWriteStream(outputPath, { flags: 'a' })

  transformedData.write('[')

  if (separatorType)
    setInitialSeparator(separatorType)

  fileStream.pipe(transform).pipe(transformedData)

  return new Promise((resolve, rejects) => {
    transformedData.on('close', async () => resolve(true))
    transformedData.on('error', error => rejects(error))
  })
}

process.on('message', async (inputs) => {
  const data = await transformStream(inputs)
  process.send(data)
  process.exit()
})
