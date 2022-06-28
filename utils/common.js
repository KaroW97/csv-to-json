const VALID_SEPARATORS = ['  ', ',', ';']
const fs = require('fs');

const getAllInputs = () => process.argv.slice(2) || {}

const getUserInputs = () => {
  const userInputs = getAllInputs().filter((element, index) => index % 2 == 1)

  return {
    inputPath: userInputs[0],
    outputPath: userInputs[1],
    separatorType: userInputs[2],
  }
}

const checkIfExists = async (fileName) => {
  try {
    await fs.promises.access(fileName)
    return true
  } catch (err) {
    return false
  }
}

module.exports = {
  VALID_SEPARATORS,
  getAllInputs,
  getUserInputs,
  checkIfExists
}