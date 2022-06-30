const fs = require('fs')

const VALID_SEPARATORS = ['  ', ',', ';']

/**
 * Returns all input provided in console
 * @returns {string[]}
 */
const getAllInputs = () => process.argv.slice(2) || {}

/**
 * Returns values for provided flags
 * @returns {Record<string, string>}
 */
const getUserInputs = () => {
  const userInputs = getAllInputs().filter((element, index) => index % 2 == 1)

  return {
    inputPath: userInputs[0],
    outputPath: userInputs[1],
    separatorType: userInputs[2]
  }
}

/**
 * Checks if file already exists
 * @param {string} fileName
 * @returns {boolean}
 */
const checkIfExists = async (fileName) => {
  try {
    await fs.promises.access(fileName)
    return true
  } catch (err) {
    return false
  }
}

/**
 * Returns Object of splitted user inputs
 * @returns {Record<string, string>}
 */
const parseUserInput = () => {
  return process.argv.slice(2).reduce((prev, current) => {
    const split = current.split('=')
    return {
      ...prev,
      [`${split[0]}`]: split[1]
    }
  }, {})
}

module.exports = {
  VALID_SEPARATORS,
  getAllInputs,
  getUserInputs,
  checkIfExists,
  parseUserInput
}
