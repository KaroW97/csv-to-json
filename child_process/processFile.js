const fs = require('fs');
const { transform } = require('./transform');
const readline = require('readline')

const transformStream = async (inputPath, outputPath) => {

  const fileStream = fs.createReadStream(inputPath, { highWaterMark: 150 });
  const transformedData = fs.createWriteStream(outputPath, { flags: 'a' })

  transformedData.write('[')
  /*  const readFile = readline.createInterface({
     input: fs.createReadStream(inputPath),
     output: fs.createWriteStream(outputPath, { flags: 'a' }),
     terminal: false
   });

   readFile
     .on('line', line => {
       transform._write(line)
     })
     .on('close', function () {
       /// console.log(`Created "${this.output.path}"`);
     }); */
  fileStream.pipe(transform).pipe(transformedData)

  return new Promise((resolve, rejects) => {
    transformedData.on('close', () => resolve(true))
    transformedData.on('error', error => rejects(error))
  })
}

process.on('message', async ({ inputPath, outputPath }) => {
  const data = await transformStream(inputPath, outputPath)
  process.send(data)
  process.exit()
})
