/**
 * Permission to file denied
 */
class PermissionDenied extends Error {
  constructor(details) {
    super('PERMISSION_DENIED')
    this.status = 403
    this.name = 'PERMISSION_DENIED'
    this.message = details
  }
}

/**
 * Credentials not found
 */
class NotFound extends Error {
  constructor(details) {
    super('NOT_FOUND')
    this.status = 404
    this.name = 'NOT_FOUND'
    this.message = details
  }
}

/**
 * Function check wether access has been denied or credential couldn't be found
 * Else it returns error and logs it
 * @param {Error} err
 * @returns {Error}
 */
exports.resolveError = (err) => {
  const { errors, code } = err || {}
  const { message } = (errors && errors[0]) || {}

  if (code === 403) throw new PermissionDenied(message)

  if (code === 404) throw new NotFound(message)

  throw err
}
