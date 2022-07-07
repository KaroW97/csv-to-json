const googleApi = require('../../src/google/googleApi');
const validation = require('../../src/utils/validation');
const common = require('../../src/utils/common');
const { google } = require('googleapis')
const { Chance } = require('chance');
const sinon = require('sinon');
const fs = require('fs');
const chance = new Chance()

describe('googleApi', () => {
  let checkIfExist, fsAccess


  beforeEach(() => {
    fsAccess = sinon.stub(fs.promises, 'access')
    checkIfExist = sinon.stub(common, 'checkIfExists')

    sinon.stub(fs, 'createReadStream')
    sinon.stub(validation, 'checkGoogleInputs').returns({
      filePath: chance.string() + 'asd.csv',
      mimeType: 'text/csv'
    })
    sinon.stub(google, 'drive').returns({
      files: {
        create: sinon.stub(),
        get: sinon.stub().resolves({
          data: {
            name: chance.string()
          }
        })
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should not throw when all params are valid', async () => {
    checkIfExist.returns(true)
    const array = [
      chance.string(),
      chance.string(),
      `filePath=${chance.string()}.csv`,
    ]

    await expect(googleApi(array)).resolves.not.toThrow()
  });

  it('should not throw when all params are valid', async () => {
    fsAccess.throws()
    checkIfExist.returns(false)
    const array = [
      chance.string(),
      chance.string(),
      `filePath=${chance.string()}.csv`,
    ]

    await expect(googleApi(array)).rejects.toThrow()
  });
});