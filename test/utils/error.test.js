const error = require('../../src/utils/error')
const { Chance } = require('chance')
const chance = Chance()

describe('error', () => {
  it('should throw BadRequest error with passed argument', () => {
    const dummyError = chance.string()
    const t = () => {
      throw new error.BadRequest(dummyError)
    }
    expect(t).toThrow(error.BadRequest)
    expect(t).toThrow(dummyError)
  })

  it('should throw FileError error with passed argument', () => {
    const dummyError = chance.string()
    const t = () => {
      throw new error.FileError(dummyError)
    }
    expect(t).toThrow(error.FileError)
    expect(t).toThrow(dummyError)
  })

  it('should throw WrongExtension error with passed argument', () => {
    const dummyError = chance.string()
    const t = () => {
      throw new error.WrongExtension(dummyError)
    }
    expect(t).toThrow(error.WrongExtension)
    expect(t).toThrow(dummyError)
  })

  it('should throw WrongExtension error with passed argument', () => {
    const dummyError = chance.string()
    const t = () => {
      throw new error.ParameterError(dummyError)
    }
    expect(t).toThrow(error.ParameterError)
    expect(t).toThrow(`Wrong parameter passed expected: ${dummyError}`)
  })

  it('should throw WrongExtension error with passed argument', () => {
    const dummyError = chance.string()
    const t = () => {
      throw new error.ParameterError(dummyError, true)
    }
    expect(t).toThrow(error.ParameterError)
    expect(t).toThrow('No parameter passed')
  })

  it('should throw FileCreationError error with passed argument', () => {
    const t = () => {
      throw new error.FileCreationError()
    }
    expect(t).toThrow(error.FileCreationError)
    expect(t).toThrow("File couldn't be created")
  })
})
