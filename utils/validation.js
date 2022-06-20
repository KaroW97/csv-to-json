const { VALID_SEPARATORS, getAllInputs } = require("./common")

const notAccepted = ['--sourceFile', '--resultFile', '--separator']

const accepted = {
  sourceFile: '--sourceFile',
  resultFile: '--resultFile',
  separator: '--separator'
}


//TODO: Add validation only for extension of the files
//TODO: Add validation to check if file is in quotes
exports.validation = () => {
  const [input, inputPath, output, outputPath, separator, separatorType] =
    getAllInputs()

  if (input !== accepted.sourceFile || output !== accepted.resultFile)
    throw new Error(`The tag is incorrect expected ${!input ? accepted.sourceFile : accepted.resultFile}`)

  if (!inputPath) throw new Error('No input path provided')
  if (inputPath && notAccepted.includes(inputPath)) throw new Error('Incorrect format')

  if (!outputPath) throw new Error('No output path provided')
  if (outputPath && notAccepted.includes(inputPath)) throw new Error('Incorrect format')

  if (separator && !separatorType) throw new Error('Requested for different separator. But type was not passed')
  if (separator && !VALID_SEPARATORS.includes(separatorType)) throw new Error('Provided separator is not supported')
}