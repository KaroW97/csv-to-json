const common = require('../../src/utils/common')
const { Chance } = require('chance')
const sinon = require('sinon')

const fs = require('fs')
const chance = Chance()

describe('common', () => {
  it('Array of valid separators should contain space, comma and semicolon  ', () => {
    expect(common.VALID_SEPARATORS).toEqual(
      expect.arrayContaining(['  ', ',', ';'])
    )
  })

  describe('getAllInputs', () => {
    it('should return empty array if no arguments passed', () => {
      expect(common.getAllInputs()).toEqual([])
    })

    it('should return empty array when length is less then 2', () => {
      let dummyArray = []

      for (let i = 0; i < 1; i++) dummyArray.push(chance.string())

      expect(common.getAllInputs(dummyArray)).toEqual([])
    })

    it('should return array shorter by 2 records', () => {
      let dummyArray = []

      for (let i = 0; i < 5; i++) dummyArray.push(chance.string())

      expect(common.getAllInputs(dummyArray).length).toEqual(3)
    })

    it('should return array when -- is on 3 position of a string ', () => {
      let dummyArray = []

      for (let i = 0; i < 5; i++) dummyArray.push(chance.string())

      dummyArray.splice(2, 0, '--')

      expect(common.getAllInputs(dummyArray).length).toEqual(3)
    })
  })

  describe('getUserInputs', () => {
    it('should return odd values ', () => {
      let dummyArray = []

      for (let i = 0; i < 8; i++) dummyArray.push(chance.string())

      expect(common.getUserInputs(dummyArray)).toEqual({
        inputPath: expect.anything(),
        outputPath: expect.anything(),
        separatorType: expect.anything()
      })
    })

    it('should return odd values and separator as undefined ', () => {
      let dummyArray = []

      for (let i = 0; i < 7; i++) dummyArray.push(chance.string())

      expect(common.getUserInputs(dummyArray)).toEqual({
        inputPath: expect.anything(),
        outputPath: expect.anything(),
        separatorType: undefined
      })
    })
  })

  describe('checkIfExists', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return true when file exist', async () => {
      sinon.stub(fs.promises, 'access').withArgs(chance.name())
      expect(await common.checkIfExists()).toBe(true)
    })

    it('should return false when file does not exist', async () => {
      sinon.stub(fs.promises, 'access').throws()
      expect(await common.checkIfExists()).toBe(false)
    })
  })

  describe('parseUserInput', () => {
    it('should return object created from user entries', () => {
      let dummyArray = []

      for (let i = 0; i < 3; i++)
        dummyArray.push(`${chance.name()}=${chance.string()}`)
      expect(typeof common.parseUserInput(dummyArray)).toEqual('object')
    })

    it('should return undefined when no data provided or not enough', () => {
      expect(typeof common.parseUserInput([])).toEqual('object')
    })
  })
})
