const fs = require('fs');
const { transform } = require('./transform');
const readline = require('readline')

transformStream = async (inputPath, outputPath) => {

  const transformedData = fs.createWriteStream(outputPath, { flags: 'a' })
  const read = fs.createReadStream(inputPath)
  const readFile = readline.createInterface({
    input: read,
    output: transformedData,
    terminal: false
  });
  new Promise(async (resolve) => {
    read.on('end', () => {
      console.log('end');
    })
    readFile.on('line', line => {
      transform._write(line, 'utf-8', (error) => { })
      resolve(transformedData.write(transform.read()))
    })
  })
  readFile.on('close', () => {
    transformedData.write(']')
    setTimeout(() => process.exit(), 100)
  })
}

process.on('message', async ({ inputPath, outputPath }) => {
  await transformStream(inputPath, outputPath)
  process.send('')
})