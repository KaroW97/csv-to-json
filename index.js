const bigFile = require('./bigFileCreator/bigFile')
const csvParser = require('./csvToJSON/csvParser')
const googleApi = require('./google/googleApi')

module.exports = {
  bigFile,
  csvParser,
  googleApi
}
