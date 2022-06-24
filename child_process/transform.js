const { Transform } = require("stream");
const Parser = require("../utils/parser");
const parser = new Parser()

exports.setInitialSeparator = (separator) => parser.setSeparator(null, separator)

exports.transform = new Transform({
  writableObjectMode: true,
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    const chunkConnected = parser.getUnprocessed() + chunk

    parser.setUnprocessed('')

    let rows = parser.splitToRows(chunkConnected)

    const lastRow = rows[rows.length - 1]

    if (!lastRow.endsWith('\n'))
      parser.setUnprocessed(lastRow)

    if (parser.getIfFirst()) {
      parser.setSeparator(rows[0], parser.getSeparator())
      parser.setHeader(rows)
    }

    const stringify = parser.parseToJSON(rows)

    parser.setIfFirst()

    callback(null, stringify);
  },

  flush(callback) {
    callback(null, "]")
  }
});