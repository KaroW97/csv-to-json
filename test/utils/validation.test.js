const rewire = require('rewire')
const rewireValidation = rewire('../../src/utils/validation')
const validation = require('../../src/utils/validation')
const common = require('../../src/utils/common')
const error = require('../../src/utils/error')
const { Chance } = require('chance')
const sinon = require('sinon')

const chance = Chance()
const fs = require('fs')

describe('validation', () => {
  describe('isEmpty', () => {
    const isEmpty = rewireValidation.__get__('isEmpty')

    it('should return true if object is empty', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false if object is not empty', () => {
      expect(
        isEmpty({
          [chance.string()]: chance.string()
        })
      ).toBe(false)
    })
  })

  describe('validation', () => {
    let checkIfExist, fsAccess
    let dummyArray = []
    for (let i = 0; i < 8; i++) dummyArray.push(chance.string())

    beforeEach(() => {
      sinon.stub(common, 'getAllInputs').returns(dummyArray)
      fsAccess = sinon.stub(fs.promises, 'access')
      checkIfExist = sinon.stub(common, 'checkIfExists')
    })

    afterEach(function () {
      sinon.restore()
    })

    it('should throw FileError error when file does not exist ', async () => {
      checkIfExist.returns(false)
      fsAccess.throws()

      expect(
        async () => await validation.validation(dummyArray)
      ).rejects.toThrowError(new error.FileError(dummyArray[3]))
    })

    it('should throw WrongExtension error when wrong extension passed', async () => {
      checkIfExist.returns(true)

      expect(
        async () => await validation.validation(dummyArray)
      ).rejects.toThrowError(
        new error.WrongExtension('Expected extensions are json or csv')
      )
    })

    it('should throw WrongExtension error when type is passed explicitly', () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummy.json'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(
        new error.WrongExtension('Expected csv file extension')
      )
    })

    it('should throw BadRequest error when no inputPath provided', () => {
      const array = [chance.string(), chance.string(), 'dummyInput']

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(new error.BadRequest('No input path provided'))
    })

    it('should throw BadRequest error when passed input name is not "--sourceFile"', () => {
      const array = [
        chance.string(),
        chance.string(),
        'dummyInput',
        'dummy.csv',
        'dummyResultFile',
        'dummyJSON.json'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(
        new error.BadRequest('The tag is incorrect expected --sourceFile')
      )
    })

    it('should throw BadRequest error when no outputPath provided', () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummy.csv',
        '--resultFile'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(new error.BadRequest('No output path provided'))
    })

    it('should throw BadRequest error when passed input name is not "--resultFile"', () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummy.csv',
        'dummyResultFile',
        'dummyJSON.json'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(
        new error.BadRequest('The tag is incorrect expected --resultFile')
      )
    })

    it('should throw BadRequest when "--separator" tag passed but no separator defined', () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummyCSV.csv',
        '--resultFile',
        'dummyJSON.json',
        '--separator'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(
        new error.BadRequest(
          'Requested for different separator. But type was not passed'
        )
      )
    })

    it('should throw BadRequest when "separator" tag passed but separator not in scope', () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummyCSV.csv',
        '--resultFile',
        'dummyJSON.json',
        '--separator',
        '.'
      ]

      expect(
        async () => await validation.validation(array)
      ).rejects.toThrowError(
        new error.BadRequest('Provided separator is not supported: .')
      )
    })

    it('should not throw when proper "separator" tag provided', async () => {
      const array = [
        chance.string(),
        chance.string(),
        '--sourceFile',
        'dummyCSV.csv',
        '--resultFile',
        'dummyJSON.json',
        '--separator',
        ','
      ]

      await expect(validation.validation(array)).resolves.not.toThrow()
    })
  })

  describe('checkGoogleInputs', () => {
    let checkIfExist, fsAccess

    beforeEach(() => {
      fsAccess = sinon.stub(fs.promises, 'access')
      checkIfExist = sinon.stub(common, 'checkIfExists')
    })

    afterEach(function () {
      sinon.restore()
    })
    it('should throw ParameterError error when object with user inputs is empty', () => {
      expect(
        async () => await validation.checkGoogleInputs()
      ).rejects.toThrowError(
        new error.ParameterError('No parameter passed', true)
      )
    })

    it('should throw ParameterError error when object does not contain filePath key', () => {
      const dummyArray = [
        chance.string(),
        chance.string(),
        `${chance.string()}=${chance.string}`
      ]
      expect(
        async () => await validation.checkGoogleInputs(dummyArray)
      ).rejects.toThrowError(new error.ParameterError('filePath'))
    })

    it('should throw ParameterError error when object does not contain filePath key', () => {
      const dummyArray = [
        chance.string(),
        chance.string(),
        `${chance.string()}=${chance.string()}`
      ]
      expect(
        async () => await validation.checkGoogleInputs(dummyArray)
      ).rejects.toThrowError(new error.ParameterError('filePath'))
    })

    it('should throw when file does not exist', async () => {
      checkIfExist.returns(false)
      fsAccess.throws()

      const filePath = chance.string() + '.csv'
      const dummyArray = [
        chance.string(),
        chance.string(),
        `filePath=${filePath}`
      ]

      expect(
        async () => await validation.checkGoogleInputs(dummyArray)
      ).rejects.toThrowError(new error.FileError(filePath))
    })

    it('should return valid response with mimeType', async () => {
      checkIfExist.returns(true)
      const filePath = chance.string() + '.csv'
      const dummyArray = [
        chance.string(),
        chance.string(),
        `filePath=${filePath}`
      ]

      const response = await validation.checkGoogleInputs(dummyArray)
      expect(response).toEqual({
        filePath: filePath,
        mimeType: 'text/csv'
      })
    })
  })

  describe('checkCreateFileInputs', () => {
    it('should return if object is empty', () => {
      const response = validation.checkCreateFileInputs()

      expect(response).toBe(undefined)
    })

    it('should throw when invalid param passed', () => {
      const filePath = chance.string() + '.csv'
      const dummyArray = [
        chance.string(),
        chance.string(),
        `filePath=${filePath}`,
        'sieze123=10'
      ]

      expect(async () =>
        validation.checkCreateFileInputs(dummyArray)
      ).rejects.toThrowError(new error.ParameterError('filePath or size'))
    })

    it('should return valid inputs', () => {
      const dummyArray = [chance.string(), chance.string(), 'size=10']

      const response = validation.checkCreateFileInputs(dummyArray)
      expect(response).toEqual({
        size: '10'
      })
    })

    it('should return valid inputs', () => {
      const filePath = chance.string() + '.csv'
      const dummyArray = [
        chance.string(),
        chance.string(),
        `filePath=${filePath}`,
        'size=10'
      ]

      const response = validation.checkCreateFileInputs(dummyArray)
      expect(response).toEqual({
        filePath,
        size: '10'
      })
    })
  })
})
