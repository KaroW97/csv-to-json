const {
  WrongExtension,
  FileError,
  BadRequest,
  ParameterError
} = require('./error')
const {
  VALID_SEPARATORS,
  getAllInputs,
  checkIfExists,
  parseUserInput
} = require('./common')

const validParamsForCreateFile = ['filePath', 'size']
const validParamsForGoogle = ['filePath']
const validMimeTypes = {
  json: 'application/json',
  csv: 'text/csv'
}
const accepted = {
  sourceFile: '--sourceFile',
  resultFile: '--resultFile',
  separator: '--separator'
}

/**
 * Checks if object is empty
 * @param {string} object
 * @returns {boolean}
 */
const isEmpty = (object) => Object.keys(object).length === 0

/**
 * Checks if inputs provided by the user are correct
 */
const validation = async (processArgv) => {
  const [input, inputPath, output, outputPath, separator, separatorType] =
    getAllInputs(processArgv)

  // Check first if input path provided
  if (!inputPath) throw new BadRequest('No input path provided')

  // Check if file exists
  const check = await checkIfExists(inputPath)

  // Throw error when file doesn't exist
  if (!check) throw new FileError(inputPath)

  //checks if extension is csv
  checkExtension(inputPath, false, 'csv')

  // Check first if output path provided
  if (!outputPath) throw new BadRequest('No output path provided')

  //checks if extension is json
  checkExtension(outputPath, false, 'json')

  if (input !== accepted.sourceFile || output !== accepted.resultFile)
    throw new BadRequest(
      `The tag is incorrect expected ${input !== accepted.sourceFile
        ? accepted.sourceFile
        : accepted.resultFile
      }`
    )

  if (separator && !separatorType)
    throw new BadRequest(
      'Requested for different separator. But type was not passed'
    )

  if (separator && !VALID_SEPARATORS.includes(separatorType))
    throw new BadRequest(
      `Provided separator is not supported: ${separatorType}`
    )
}

/**
 * Checks if passed file contains proper extension
 * And if expected returns mimeType
 * @param {string} fileName
 * @param {boolean} mimeType
 * @returns {Record<string, string>}
 */
const checkExtension = (fileName, mimeType = true, explicitType) => {
  const fileExtension = fileName.split('.').splice(-1)

  const extensionIndex = ['csv', 'json'].indexOf(fileExtension[0])

  if (extensionIndex === -1)
    throw new WrongExtension('Expected extensions are json or csv')

  // When explicitType extension is passed throw if file has different one
  if (explicitType && explicitType !== fileExtension[0])
    throw new WrongExtension(`Expected ${explicitType} file extension`)

  if (mimeType) return { mimeType: validMimeTypes[fileExtension[0]] }
}

/**
 * Function checks if the file exists and if it has correct extension
 * Then it returns filePath and mime type
 * @returns {Record<string, string>}
 */
const checkGoogleInputs = async (processArgv) => {
  const inputs = parseUserInput(processArgv)

  // Check if created object is empty
  if (isEmpty(inputs)) throw new ParameterError('filePath', true)

  // Check if object contains filePath param
  Object.keys(inputs).filter((input) => {
    if (!validParamsForGoogle.includes(input))
      throw new ParameterError(validParamsForGoogle.join(''))
  })

  // Check extension
  const mimeType = checkExtension(inputs.filePath)

  // Check if file exists
  const check = await checkIfExists(inputs.filePath)

  // Throw error when file doesn't exist
  if (!check) throw new FileError(inputs.filePath)

  return { ...inputs, ...mimeType }
}

/**
 * Function create inputs from provided inputs, if given
 * Then checks if extension is in scope
 * @returns {Record<string,string>}
 */
const checkCreateFileInputs = (processArgv) => {
  // Create object of inputs
  const inputs = parseUserInput(processArgv)

  // If empty return
  if (isEmpty(inputs)) return

  // If some input passed check if they are in the scope
  Object.keys(inputs).filter((input) => {
    if (!validParamsForCreateFile.includes(input))
      throw new ParameterError(validParamsForCreateFile.join(' or '))
  })

  // Check extension
  if (inputs.filePath) checkExtension(inputs.filePath, false, 'csv')

  return inputs
}
module.exports = {
  checkExtension,
  validation,
  checkGoogleInputs,
  checkCreateFileInputs
}
