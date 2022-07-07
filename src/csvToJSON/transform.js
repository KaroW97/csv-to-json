const { Transform } = require('stream')
const Parser = require('../utils/parser')
const parser = new Parser()

/**
 * Sets separatorType for future action
 * @param {string} separator
 */
exports.setInitialSeparator = (separator) =>
  parser.setSeparator(null, separator)

exports.transform = new Transform({
  writableObjectMode: true,
  readableObjectMode: true,
  /**
   *
   * @param {string} chunk
   */
  transform(chunk, encoding, callback) {
    // Add unprocessed value from prev iteration to current chunk
    const chunkConnected = parser.getUnprocessed() + chunk

    // After concatenation clear
    parser.setUnprocessed('')

    // Split on separate rows
    let rows = parser.splitToRows(chunkConnected)

    // Get last element from array
    const lastRow = rows[rows.length - 1]

    // Check if contains nextLine sign
    if (!lastRow.endsWith('\n')) parser.setUnprocessed(lastRow)

    // If its first iteration, set header and separator
    if (parser.getIfFirst()) {
      parser.setSeparator(rows[0])
      parser.setHeader(rows)
    }

    // Process data and assign to proper headers
    // Then change it to string
    const stringify = parser.parseToJSON(rows)

    // Set first iteration to false
    parser.setIfFirst()

    callback(null, stringify)
  },

  flush(callback) {
    callback(null, ']')
  }
})
