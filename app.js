const { readFile } = require('./helpers/commonFunctions')

const acceptedInputs = ['sourceFile', 'resultFile', 'separator']

const [
  input,
  inputPath,
  output,
  outputPath,
  separator,
  separatorType] = process.argv.slice(2) || {}

console.log(process.argv.slice(2));

const main = async () => {
  console.log(await readFile(inputPath));
}


main()

