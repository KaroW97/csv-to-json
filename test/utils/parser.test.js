const Parser = require('../../src/utils/parser')
const { Chance } = require('chance')

const chance = Chance()
const parser = new Parser()

describe('Parser', () => {
  const dummyField = chance.string()
  let dummyString = ''
  for (let i = 0; i < 2; i++) {
    dummyString += chance.string() + ',' + chance.string() + '\r\n'
  }
  it('should return array, splited when \n occuers ', () => {
    const splitArray = dummyString.split('\n')
    splitArray.pop()

    expect(parser.splitToRows(dummyString)).toEqual(splitArray)
  })

  it('should set separator ', () => {
    const splitArray = dummyString.split('\n')[0]

    parser.setSeparator(splitArray)
    expect(parser.getSeparator()).toBe(',')
  })

  it('should set header ', () => {
    const splitArray = dummyString.split('\n')
    splitArray.pop()

    parser.setSeparator(splitArray[0])
    parser.setHeader(splitArray)

    expect(parser.header).toEqual(splitArray[0].split(','))
  })

  it('should set delete brackets from array ', () => {
    const dummyArray = [{ dummyField: 'dummyField' }]
    const response = parser.deleteBrackets(dummyArray)
    expect(response).not.toEqual(expect.stringContaining(']'))
    expect(response).not.toEqual(expect.stringContaining('['))
  })

  it('should parse to json array of strings and add [ at the beginning ', () => {
    const splitArray = dummyString.split('\n')

    parser.setSeparator(splitArray[0])
    parser.setHeader(splitArray)

    const dummyNumber = chance.integer()
    const dummyArray = [dummyField, dummyField, `${dummyNumber}`]

    const response = parser.parseToJSON(dummyArray)

    expect(typeof response).toBe('string')
    expect(response).toEqual(expect.stringContaining('['))
  })

  it('should parse to json array of strings and add COMMA at the beginning', () => {
    const splitArray = dummyString.split('\n')

    parser.setSeparator(splitArray[0])
    parser.setIfFirst()
    parser.setHeader(splitArray)

    const dummyNumber = chance.integer()
    const dummyArray = [dummyField, dummyField, `${dummyNumber}`]

    const response = parser.parseToJSON(dummyArray)

    expect(typeof response).toBe('string')
    expect(response).toEqual(expect.stringContaining(','))
    expect(response).toEqual(expect.not.stringContaining('['))
  })

  it('should checkIfFirst field be set to false', () => {
    parser.setIfFirst()
    expect(parser.getIfFirst()).toBe(false)
  })

  it('should unprocessed field be some value', () => {
    parser.setUnprocessed(dummyField)
    expect(parser.getUnprocessed()).toBe(dummyField)
  })
})
