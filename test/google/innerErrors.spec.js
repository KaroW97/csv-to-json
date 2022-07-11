const rewire = require('rewire')
const { Chance } = require('chance');
const chance = new Chance()
const errors = rewire('../../src/google/innerErrors')

describe('innerErrors', () => {
  const notFound = errors.__get__('NotFound')
  const permissionDenied = errors.__get__('PermissionDenied')
  it('should throw PermissionDenied when error code 403', () => {
    const errorMessage = chance.string()
    const error = {
      code: 403,
      message: errorMessage
    }

    expect(() => errors.resolveError(error)).toThrow(permissionDenied)
  });

  it('should throw PermissionDenied when error code 403', () => {
    const errorMessage = chance.string()
    const error = {
      code: 404,
      message: errorMessage
    }

    new notFound()
    expect(() => errors.resolveError(error)).toThrow(notFound)
  });

  it('should throw error when its not 404 or 403', () => {
    const errorMessage = chance.string()
    const error = {
      code: 400,
      message: errorMessage
    }

    new notFound()
    expect(() => errors.resolveError(error)).toThrowError(errorMessage)
  });
});