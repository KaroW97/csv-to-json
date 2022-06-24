const VALID_SEPARATORS = ['  ', ',', ';']
const DEFAULT = 'auto-detect'

const getAllInputs = () => process.argv.slice(2) || {}

const getSeparatorType = () => {

  return getAllInputs()[5]
}

const getUserInputs = () => {
  const [input, inputPath, output, outputPath, separator, separatorType] = getAllInputs()
  return {
    inputPath,
    outputPath,
    separatorType,
  }
}

module.exports = {
  VALID_SEPARATORS,
  DEFAULT,
  getAllInputs,
  getSeparatorType,
  getUserInputs
}