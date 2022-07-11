const { loggerSuccess } = require('../../src/utils/logger')
const { Chance } = require('chance')
const chance = new Chance()

describe('loggerSuccess', () => {
  it('should log message', () => {
    const dummyPath = chance.string()

    console.info = jest.fn()

    loggerSuccess(dummyPath)

    expect(console.info.mock.calls[0][0]).toEqual({
      message: `Save completed in file: ${dummyPath}`,
      status: 200
    })
  })
})
