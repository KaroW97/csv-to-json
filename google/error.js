const { loggerError } = require("./logger");

class PermissionDenied extends Error {
  constructor(status, name) {
    loggerError(status, name)
  }
}

class NotFound extends Error {
  constructor(status, name, description) {
    loggerError(status, name, description)
  }
}

class FileError {
  constructor(filePath) {
    this.code = 404
    this.errors = [
      {
        message: 'File not found',
        reason: `Couldn't be found under given path: ${filePath}`
      }
    ]
  }
}

const resolveError = (err) => {
  const { errors, code } = err || {}
  const { reason, message } = errors && errors[0] || {}

  if (reason === 'insufficientParentPermissions')
    return new PermissionDenied(code, 'PERMISSION_DENIED')
  if (code === 404)
    return new NotFound(code, reason, message)

  console.error(err);

  return err
}

module.exports = {
  FileError,
  resolveError
}