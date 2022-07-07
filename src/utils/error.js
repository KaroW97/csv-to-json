/**
 * When user uses incorrect tag
 */
class BadRequest extends Error {
  constructor(details) {
    super('BAD_REQUEST')
    this.status = 400
    this.name = 'BAD_REQUEST'
    this.message = details
  }
}

/**
 * File access error
 */
class FileError extends BadRequest {
  constructor(filePath) {
    super(`File couldn't be found under given path: ${filePath}`)
  }
}

/**
 * Incorrect file extension
 */
class WrongExtension extends BadRequest {
  constructor(description) {
    super(description)
  }
}

/**
 * Checks if parameters were passed if expected
 */
class ParameterError extends BadRequest {
  constructor(paramName, isEmpty = false) {
    const details = !isEmpty
      ? `Wrong parameter passed expected: ${paramName}`
      : 'No parameter passed'
    super(details)
  }
}

/**
 * Error ocurred during file creation
 */
class FileCreationError extends Error {
  constructor() {
    super('FILE_CREATION')
    this.status = 501
    this.name = 'FILE_CREATION'
    this.message = "File couldn't be created"
  }
}

module.exports = {
  FileError,
  WrongExtension,
  FileCreationError,
  BadRequest,
  ParameterError
}
