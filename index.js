const bigFile = require('./src/bigFileCreator/bigFile')
const csvParser = require('./src/csvToJSON/csvParser')
const googleApi = require('./src/google/googleApi')

module.exports = {
  bigFile,
  csvParser,
  googleApi
}
